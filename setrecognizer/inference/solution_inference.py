import cv2
import numpy as np
import os
import sys
from timeit import default_timer as time
from threading import Lock
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from inference.yolov4_wrapper import YoloV4BoxDetector
from inference.ocr_wrapper import load_paddle_ocr
from inference.image_search import get_top_k_image_from_google_search


class FunctionServingWrapper(object):
    """
    Class of wrapper for restriction count of simultaneous function calls
    """
    def __init__(self,
                 callable_function: callable,
                 count_of_parallel_users: int = 1):
        self.callable_function = callable_function
        self.resources = [Lock() for _ in range(count_of_parallel_users)]
        self.call_mutex = Lock()

    def __call__(self, *args, **kwargs):
        """
        Run call method of target callable function
        Args:
            *args: args for callable function
            **kwargs: kwargs for callable function
        Returns:
            Return callable function results
        """
        self.call_mutex.acquire()
        i = -1
        while True:
            for k in range(len(self.resources)):
                if not self.resources[k].locked():
                    i = k
                    break
            if i > -1:
                break

        self.resources[i].acquire()
        self.call_mutex.release()

        result = self.callable_function(*args, **kwargs)
        self.resources[i].release()

        return result


def filter_text_string(s: str) -> str:
    return s.replace('o', '0')\
        .replace('O', '0')\
        .replace('D', '0')\
        .replace('i', '1')\
        .replace('I', '1')


class LegoSetRecognitionSystem(object):
    def __init__(self):
        self.detection_model = YoloV4BoxDetector(
            config=os.path.join(
                os.path.dirname(__file__),
                '../data/yolov4_inference_configuration/yolov4_config.yml'
            )
        )

        self.ocr_model = load_paddle_ocr()

        browser_options = Options()
        browser_options.add_argument('--headless')
        browser_options.add_argument('--no-sandbox')
        browser_options.add_argument('--disable-dev-shm-usage')
        self.driver = webdriver.Chrome(
            options=browser_options,
            executable_path=os.path.join(
                os.path.dirname(__file__),
                '../data/chromedriver'
            )
        )

    def get_detections(self, image: np.ndarray) -> list:
        detection = self.detection_model(image)
        if detection is None:
            return []

        return [
            [detection[0][_i], detection[2][_i]]
            for _i in range(len(detection[0]))
        ]

    def get_set_number(self, detection_crop: np.ndarray) -> tuple:
        _, texts, confs = self.ocr_model.pipeline_inference(detection_crop)
        result_number = ''
        confidence = 0
        for i, text in enumerate(texts):
            filtered_text = filter_text_string(text)
            filtered_text = filtered_text.replace(' ', '')
            if filtered_text.isdecimal() and len(filtered_text) > 2:
                if len(filtered_text) > len(result_number):
                    result_number = filtered_text
                    confidence = confs[i]
        return (None, 0) if len(result_number) == 0 else \
            (result_number, float(confidence))

    def __call__(self, image: np.ndarray):
        result_sets_detections = []

        boxes_detections = self.get_detections(image)
        if len(boxes_detections) == 0:
            set_number, text_conf = self.get_set_number(image)
            return [
                {
                    'box': [0, 0, 1, 1],
                    'number': set_number,
                    'confidence': float(text_conf)
                }
            ] if set_number is not None else []

        for set_rectangle, rect_conf in boxes_detections:
            _x1, _y1, _x2, _y2 = set_rectangle
            _crop = image[_y1:_y2, _x1:_x2].copy()

            set_number, text_conf = self.get_set_number(_crop)

            if set_number is None:
                top_1_image = get_top_k_image_from_google_search(
                    self.driver,
                    _crop
                )
                if len(top_1_image) > 0:
                    set_number, text_conf = self.get_set_number(top_1_image[0])

            if set_number is not None:
                result_sets_detections.append(
                    {
                        'box': [
                            _x1 / image.shape[1],
                            _y1 / image.shape[0],
                            (_x2 - _x1) / image.shape[1],
                            (_y2 - _y1) / image.shape[0]
                        ],
                        'number': set_number,
                        'confidence': float(rect_conf * text_conf)
                    }
                )

        return result_sets_detections


if __name__ == '__main__':
    example_image = 'data/images/48.jpg'
    img = cv2.cvtColor(cv2.imread(example_image), cv2.COLOR_BGR2RGB)

    set_recognition_system = FunctionServingWrapper(LegoSetRecognitionSystem())

    print(set_recognition_system(img))
