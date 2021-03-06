import cv2
import base64
import numpy as np
from timeit import default_timer as timer
from selenium.common.exceptions import WebDriverException
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
import os
import tempfile
from PIL import Image
import requests


def string_to_image(s: str) -> np.ndarray:
    return cv2.cvtColor(
        cv2.imdecode(
            np.frombuffer(base64.b64decode(s), dtype=np.uint8),
            flags=1
        ),
        cv2.COLOR_BGR2RGB
    )


def parse_google_search_resulting_page(
        browser_driver,
        k: int = 1,
        wait_time=2.0):
    result_images = []
    for i in range(k + 2):
        try:
            img_button = browser_driver.find_element_by_css_selector(
                '#islrg > div.islrc > div:nth-child({}) > a.wXeWr.islib.nfEiy.mM5pbd > div.bRMDJf.islir > img'.format(i + 1)
            )
            ActionChains(browser_driver).click(img_button).perform()
            image_area = browser_driver.find_element_by_css_selector('#yDmH0d')
            img_div = image_area.find_element_by_css_selector(
                'div > div > div.pxAole > div.tvh9oe.BIB1wf > c-wiz > div > div.OUZ5W > div.zjoqD > div > div.v4dQwb > a > img'
            )
            img_url = img_div.get_property('src')
            start_loop_time = timer()
            while 'http' not in img_url:
                img_url = img_div.get_property('src')

                current_step_time = timer()
                if wait_time - (current_step_time - start_loop_time) < 1E-5:
                    break

            if 'http' not in img_url:
                continue
            downloaded_img = np.array(
                Image.open(
                    requests.get(img_url, stream=True).raw
                ).convert('RGB')
            )
        except Exception as e:
            print(e)
            continue

        result_images.append(downloaded_img)
        if len(result_images) == k:
            break

    return result_images


def get_number_or_top_k_image_from_google_search(
        browser_driver,
        image: np.ndarray,
        k: int = 1,
        search_page: str = 'https://images.google.com/',
        wait_time=2.0,
        find_set_number: bool = False) -> tuple:
    try:
        browser_driver.get(search_page)
    except WebDriverException:
        return None, []

    try:
        search_button = browser_driver.find_element_by_css_selector(
            '#sbtc > div > div.dRYYxd > div.LM8x9c'
        )
        ActionChains(browser_driver).click(search_button).perform()
        download_file_button = browser_driver.find_element_by_css_selector(
            '#dRSWfb > div > a'
        )
        ActionChains(browser_driver).click(download_file_button).perform()
        input_file_form = browser_driver.find_element_by_css_selector(
            '#awyMjb'
        )

        _, filename = tempfile.mkstemp()
        filename += '.jpg'
        assert cv2.imwrite(filename, cv2.cvtColor(image, cv2.COLOR_RGB2BGR))
        input_file_form.send_keys(filename)
        os.remove(filename)

        if find_set_number:
            try:
                by_image_pages_section = browser_driver.find_element_by_css_selector(
                    '#rso > div:nth-child(3)'
                )
                for page_section in by_image_pages_section.find_elements_by_class_name('g'):
                    title = page_section.find_element_by_css_selector(
                        'div > div > div.yuRUbf > a > h3'
                    )
                    title_text = title.text

                    for title_word in title_text.split(' '):
                        if title_word.isdecimal() and len(title_word) > 2 and len(title_word) <= 8:
                            if title_word not in ['2019', '2020', '2021']:
                                return title_word, []
            except WebDriverException:
                pass

        images_search_button = browser_driver.find_element_by_css_selector(
            '#rso > div:nth-child(2) > div > g-section-with-header > div.e2BEnf.U7izfe.mfMhoc > title-with-lhs-icon > a > div.iJ1Kvb > h3'
        )
        ActionChains(browser_driver).click(images_search_button).perform()
    except WebDriverException:
        return None, []

    return None, parse_google_search_resulting_page(browser_driver, k, wait_time)


if __name__ == '__main__':
    browser_options = Options()
    # browser_options.add_argument('--headless')
    browser_options.add_argument('--start-maximized')

    driver = webdriver.Chrome(
        options=browser_options,
        executable_path=os.path.join(
            os.path.dirname(__file__),
            '../data/chromedriver'
        )
    )

    example_image = os.path.join(
        os.path.dirname(__file__),
        '../data/images/212.jpg'
    )
    img = cv2.cvtColor(cv2.imread(example_image), cv2.COLOR_BGR2RGB)

    set_number, images = get_number_or_top_k_image_from_google_search(
        driver,
        img,
        1,
        find_set_number=True
    )

    if set_number is not None:
        print('Set number: {}'.format(set_number))
    else:
        print('Can\'t find set number.')

    for q, image in enumerate(images):
        assert cv2.imwrite(
            os.path.join(
                os.path.dirname(__file__),
                '../data/temp_downloading/',
                '{}.jpg'.format(q + 1)
            ),
            cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        )
