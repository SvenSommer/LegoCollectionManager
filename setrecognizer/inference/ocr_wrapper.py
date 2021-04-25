from argparse import Namespace
from typing import Optional
from data.PaddleOCR.tools.infer.predict_system import TextSystem

import json
import os


def load_paddle_ocr():
    with open(
            os.path.join(
                os.path.dirname(__file__),
                '../data/PaddleOCR/paddleocr_args.json'
            ),
            'r'
    ) as f:
        ocr_args_data = json.load(f)

        for item in [
            'image_dir',
            'det_model_dir',
            'rec_model_dir',
            'rec_char_dict_path',
            'vis_font_path',
            'cls_model_dir'
        ]:
            ocr_args_data[item] = os.path.join(
                os.path.dirname(__file__),
                '../',
                ocr_args_data[item]
            )

        text_sys_args = Namespace(**ocr_args_data)

    return TextSystem(text_sys_args)
