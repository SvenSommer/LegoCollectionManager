const axios = require('axios');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

export function CheckExternalIp() {
    return new Promise(function(resolve, reject) {
        axios.get('http://ifconfig.me/ip')
        .then(function (response: any) {
            console.log("external IP:", response.data);
            AddIpAdressToConsumerPage(response.data);
            resolve(response.data);
        })
        .catch(function (error: any) {
            // handle error
            console.log(error);
            reject(false);
          })
        .then(function () {
        // always executed
        });
    })
}

export async function AddIpAdressToConsumerPage(ip:string) {
    const baseUrl = 'https://www.bricklink.com/v2/api/register_consumer.page';

    const browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		args: [
			"--no-sandbox",
			"--disable-web-security",
			"--disable-features=IsolateOrigins,site-per-process",
			"--start-maximized",
		//	"--user-agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'",
		],
		ignoreHTTPSErrors: true,
	});

    const page = await browser.newPage()
    await page.setCacheEnabled(false)
	await page.setRequestInterception(true);
	await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
	await page.setDefaultTimeout(15 * 60 * 1000)

    	// Handling all errors
	const handleClose = async (message = "Closing the browser on unexpected Error") => {
		console.log(message)
		for (const page of await browser.pages()) {
			if (!await page.isClosed()) {
				await page.close();
			}
		}
		process.exit(1)
	}

    process.on("uncaughtException", (e:any) => {
		handleClose(`Uncaught Exception ${e.message}`)
	})

	process.on("unhandledRejection", (e:any) => {
		//e.stack returns the line of the script with the error
		handleClose(`Request exception: ${e.message} - Line:${e.stack}`)
	})

    console.log("* Going to the url: ", baseUrl)
	await page.goto(baseUrl, { waitUntil: "networkidle2" })
	await page.waitForTimeout(2000)
    console.log("* Loading the page...")
}