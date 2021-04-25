import os
from sys import platform
import yaml

if platform == 'darwin':
    import matplotlib
    matplotlib.use('TkAgg')

import sys
yolo_detector_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    '../data/yolov3/'
)
sys.path.append(yolo_detector_path)

from data.yolov3.models import *
from data.yolov3.utils.parse_config import parse_data_cfg
from data.yolov3.utils.datasets import *
from data.yolov3.utils.utils import *


class YoloDetector:
    def __init__(self, config, device='cpu'):
        self.device = device
        self.img_size = config['img_size']
        self.model = Darknet(config['cfg'], self.img_size)
        self.model.load_state_dict(
            torch.load(config['weights'], map_location=device)['model']
        )

        self.model.fuse()
        self.model.to(device).eval()

        self.confidence = config['conf_thres']
        self.numbers_of_thresholds = config['nms_thres']

        self.classes = load_classes(parse_data_cfg(config['data_cfg'])['names'])

        img = torch.zeros((1, 3, self.img_size, self.img_size), device=device)
        _ = self.model(img) if device != 'cpu' else None

    def detect(self, inp_img, prepare=True):
        """
        Detection by yolo
        Args:
            inp_img: input image in RGB format as np.uint8 array
            prepare:

        Returns:
            yolo detections boxes, classes, confidences
        """
        if prepare:
            d = letterbox(inp_img, new_shape=self.img_size)
            img = d[0].transpose(2, 0, 1)
            img = np.ascontiguousarray(img, dtype=np.float32)
            img /= 255.0

            img = torch.from_numpy(
                img
            ).unsqueeze(0).to(self.device)
        else:
            img = inp_img

        pred = self.model(img, augment=False)[0]
        det = non_max_suppression(
            pred, self.confidence, self.numbers_of_thresholds
        )[0]

        if det is not None and len(det) > 0:
            det[:, :4] = scale_coords(
                img.shape[2:], det[:, :4], inp_img.shape[:2]
            ).round()

            return (
                det[:, :-1].detach().to('cpu').numpy().astype(
                    np.int32)[:, :4].tolist(),
                [
                    self.classes[int(d)]
                    for d in det.detach().to('cpu').numpy()[:, -1]
                ],
                det[:, 4].detach().to('cpu').numpy()
            )
        return None


class YoloV4BoxDetector:
    def __init__(self,
                 config,
                 device='cpu'):
        with open(config, 'r') as f:
            config = yaml.safe_load(f)
            for item in ['cfg', 'data_cfg', 'weights']:
                config[item] = os.path.join(
                    os.path.dirname(os.path.abspath(__file__)),
                    '../',
                    config[item]
                )

        self.yolo = YoloDetector(config, device)
        self.merge = config['merge_similar_boxes']

    def __call__(self, img) -> tuple:
        """
        Detect boxes on image
        Args:
            img: image ndarray of np.uint8 values

        Returns:
            Lists of boxes, classes, confidences
        """
        return self.yolo.detect(img)
