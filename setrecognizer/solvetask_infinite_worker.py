import json
from argparse import ArgumentParser, Namespace
import time
import logging
import requests


def parse_args() -> Namespace:
    parser = ArgumentParser()
    parser.add_argument('--ip', required=False, type=str, default='0.0.0.0')
    parser.add_argument('--port', required=False, type=int, default=5000)
    parser.add_argument(
        '--sleep-time', required=False, type=int, default=60,
        help='Sleeping time in seconds.'
    )
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(message)s',
        datefmt='%m/%d/%Y %I:%M:%S %p'
    )

    url_link = 'http://{}:{}/api/solvetasks'.format(args.ip, args.port)

    while True:
        r = requests.get(
            url=url_link
        )
        logging.info('Call with code: {}'.format(r.status_code))
        time.sleep(args.sleep_time)
