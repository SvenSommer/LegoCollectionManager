from argparse import ArgumentParser, Namespace
from flask import Flask, jsonify, abort, request, Response
import io
import logging
import numpy as np
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


@app.route('/api/inference/url/', methods=['GET'])
def solution_inference_by_url():
    image_url_str = request.args.get('image')

    image = None
    try:
        response = requests.get(image_url_str)
        image = np.array(
            Image.open(io.BytesIO(response.content)).convert('RGB')
        )
    except Exception as e:
        logging.error(
            'From method solution_inference_by_url(image_url), {}'.format(e)
        )
        abort(408)

    return jsonify(solution_inference(image))


@app.route('/api/inference/path/', methods=['GET'])
def solution_inference_by_path():
    image_path_str = request.args.get('path')

    image = None
    try:
        image = np.array(
            Image.open(image_path_str).convert('RGB')
        )
    except Exception as e:
        logging.error(
            'From method solution_inference_by_path(image_url), {}'.format(e)
        )
        abort(408)

    return jsonify(solution_inference(image))


if __name__ == '__main__':
    args = args_parse()
    app.run(host=args.ip, debug=False, port=args.port)
