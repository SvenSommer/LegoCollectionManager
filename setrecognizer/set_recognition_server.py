from argparse import ArgumentParser, Namespace
from flask import Flask, jsonify, abort, request, Response
import io
import logging
import numpy as np
import json
import time
import requests
from PIL import Image
from functools import reduce


def args_parse() -> Namespace:
    parser = ArgumentParser()
    parser.add_argument('--ip', required=False, type=str, default='0.0.0.0')
    parser.add_argument('--port', required=False, type=int, default=5000)
    return parser.parse_args()


app = Flask(__name__)
app_log = logging.getLogger('werkzeug')
app_log.setLevel(logging.ERROR)


def solution_inference(img: np.ndarray) -> dict:
    """
    Pipeline inference
    Args:
        img: image in uint8 RGB HWC format

    Returns:
        List with detections in [box, set number] format
    """
    if img is None:
        abort(409)

    # Now this method returns random values
    res = {
        'detections': []
    }

    for i in range(np.random.randint(0, 10)):
        w = np.random.randint(img.shape[1] // 10, 2 * img.shape[1] // 3)
        h = np.random.randint(img.shape[0] // 10, 2 * img.shape[0] // 3)

        x = np.random.randint(0, img.shape[1] - w - 1)
        y = np.random.randint(0, img.shape[0] - h - 1)

        number = reduce(
            lambda s1, s2: s1 + s2,
            [str(k) for k in np.random.randint(0, 10, size=5)]
        )

        res['detections'].append(
            {
                'box': [
                    x / img.shape[1],
                    y / img.shape[0],
                    w / img.shape[1],
                    h / img.shape[0]
                ],
                'number': number
            }
        )

    return res


def getImageFromUrl(image_url_str):
    image = None
    try:
        response = requests.get(image_url_str)
        image = np.array(
            Image.open(io.BytesIO(response.content)).convert('RGB')
        )
    except Exception as e:
        logging.error(
            'From method getImageFromUrl(image_url_str), {}'.format(e)
        )
        abort(408)
    return image
    
def getImageFromPath(image_path):
    image = None
    try:
        image = np.array(
            Image.open(image_path_str).convert('RGB')
        )
    except Exception as e:
        logging.error(
            'From method solution_inference_by_path(image_path), {}'.format(e)
        )
        abort(408)
    return image

@app.route('/api/solvetasks', methods=['GET'])
def solvetasks():
    timer_start = time.perf_counter()
    # Login
    s = requests.Session() 
    payload = {'username': 'setrecognition_worker', 'password': 'pass'}
    s.post("http://localhost:3001/users/login", data=payload)

    # Get Tasks
    data_json = s.get("http://localhost:3001/tasks/type/2/open").json()
    tasks = data_json["result"]
    
    #Loop Tasks
    task_counter = 0

    for t in tasks:
        task_id = t["id"]
        information_json = json.loads(t["information"])
        if 'image_id' not in information_json.keys():
            # Mark task with error status 
            print(s.put("http://localhost:3001/tasks/{task_id}/status", data={'id':task_id,'status_id':4}).text)
        image_id = information_json["image_id"]

        if 'imageurl' in information_json.keys():
            url = str(information_json["imageurl"])
            image = getImageFromUrl(url)
        elif 'path' in information_json.keys():
            path = str(information_json["path"])
            image = getImageFromPath(path)

        # Store the result
        s.put("http://localhost:3001/offers_images/{image_id}", data={'id':image_id,'detections':str(solution_inference(image))})
        # Mark task as completed
        #s.put("http://localhost:3001/tasks/{task_id}/status", data={'id':task_id,'status_id':3})
        task_counter += 1
    timer_end = time.perf_counter()
    return jsonify({"solvedTasks" : task_counter, "elapsedTime": f"{timer_end - timer_start:0.4f} seconds"  })

@app.route('/api/inference/url', methods=['POST'])
def solution_inference_by_url():
    request_data = request.get_json()
    if 'url' not in request_data.keys():
        abort(405)
    image_url_str = request_data['url']

    image = getImageFromUrl(image_url_str)

    return jsonify(solution_inference(image))


@app.route('/api/inference/path', methods=['POST'])
def solution_inference_by_path():
    request_data = request.get_json()
    if 'path' not in request_data.keys():
        abort(405)
    image_path_str = request_data['path']

    image = getImageFromPath(image_path_str)

    return jsonify(solution_inference(image))


if __name__ == '__main__':
    args = args_parse()
    app.run(host=args.ip, debug=False, port=args.port)
