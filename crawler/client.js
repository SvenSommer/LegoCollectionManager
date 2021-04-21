// =================================================
// * IMPORTS
// =================================================
const LOGLEVEL = "INFO"
// const { Log } = require('./services/log')
const { storeData } = require("./services/storeData")
const { getData } = require("./services/getData")
const { getToken } = require("./utils")
// =================================================
// * CONFIG
// =================================================
const USERNAME = "scraper"
const PASSWORD = "pw"
const CREDENTIALS = {
	username: USERNAME,
	password: PASSWORD
}
const API_URL = "http://localhost:3001"
const API_REQUEST = {
	AUTH: "/users/login",
	OPEN_TAKS: "/tasks/type/3/open"
}

// =================================================
// * SELECTORS
// =================================================
const acceptCookiesSelector = "#gdpr-banner-accept"

const loginSelector = ".login-overlay"
const closeLoginSelector = ".login-overlay a.overlay-close"

const modalSelector = "#vap-ovrly-secure"
const buttonCloseModal = "#vap-ovrly-secure .mfp-close"

const loginButtonSelector = "nav li a"
const emailSelector = "#login-email"
const passwordSelector = "#login-password"
const submitLoginSelector = "#login-submit"

const contactFormSelector = "#viewad-contact-form"
const messageFormSelector = "#viewad-contact-form textarea"
const nameInputSelector = "#viewad-contact-form [name=contactName]"
const phoneInputSelector = "#viewad-contact-form [name=phoneNumber]"
const submitFormSelector = "#viewad-contact-form button"
const main = async () => {

	// IMPORTS
	const puppeteer = require('puppeteer-extra')

	// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
	const StealthPlugin = require('puppeteer-extra-plugin-stealth')
	puppeteer.use(StealthPlugin())

	// Add adblocker plugin to block all ads and trackers (saves bandwidth)
	const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
	puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

	const headless = true
	// Launch browser  & init page
	const browser = await puppeteer.launch({
		headless: headless,
		defaultViewport: null,
		args: [
			"--no-sandbox",
			"--disable-web-security",
			"--disable-features=IsolateOrigins,site-per-process",
			"--start-maximized",
			"--user-agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'",
		],
		ignoreHTTPSErrors: true,
	});

	// =================================================
	// * MAKING THE API CALLS
	// =================================================

	const auth = await storeData(API_URL + API_REQUEST.AUTH, CREDENTIALS);
	let isAuthenticated = false
	const reqCredentials = {
		headers: {
			Cookie: ""
		}
	}
	if (auth.data.code === 200) {
		isAuthenticated = true
		const token = getToken(auth)
		reqCredentials.headers.Cookie = token
	}

	if (!isAuthenticated) {
		console.log("!! You are not authenticated")
		// Log(LOGLEVEL, "!! You are not authenticated", reqCredentials)
		process.exit(1)
	}

	//* Getting the open tasks
	let tasks = await getData(API_URL + API_REQUEST.OPEN_TAKS, reqCredentials)
	for (const task of tasks.data.result) {

		const task_id = task.id;
		const taskinfo = JSON.parse(task.information)
		// =================================================
		// * OPENING THE BROWSER
		// =================================================
		const page = await browser.newPage()
		await page.setCacheEnabled(false)
		await page.setDefaultTimeout(15 * 60 * 1000)

		// Handling all errors
		const handleClose = async (message = "Closing the browser on unexpected Error") => {
			console.log(message)
			// Log("ERROR", message, reqCredentials)
			for (const page of await browser.pages()) {
				if (!await page.isClosed()) {
					await page.close();
				}
			}
			process.exit(1)
		}

		process.on("uncaughtException", (e) => {
			handleClose(`Uncaught Exception ${e.message}`)
		})

		process.on("unhandledRejection", (e) => {
			//e.stack returns the line of the script with the error
			handleClose(`Request exception: ${e.message} - Line:${e.stack}`)
		})

		// const {url, account, messagetext} = taskinfo;
		// const {email, password, userName, userPhone} = account;
		//* Starting the process
		try {
			console.log("* Going for offer url: ", taskinfo.url);
			// Log(LOGLEVEL, "* Going for offer url: " + url, reqCredentials)
			await page.goto(taskinfo.url, { timeout: 10000 })
		} catch (error) {
			await handleClose("!! The url can't be loaded")
		}
		await page.waitForTimeout(1500)

		if (await page.$(modalSelector)) {
			await page.$eval(buttonCloseModal, el => el.click())
			await page.waitForTimeout(800)
		}

		if (await page.$(acceptCookiesSelector)) {
			console.log("* Accepting cookies")
			// Log(LOGLEVEL, "* Accepting cookies", reqCredentials)
			await page.$eval(acceptCookiesSelector, el => el.click())
			await page.waitForTimeout(2500)
		}

		await page.waitForTimeout(1500)
		if (await page.$(loginSelector)) {
			await page.$eval(closeLoginSelector, el => el.click())
			await page.waitForTimeout(1000)
		}

		//* Login with credentials
		let formAvailable = true
		await page.$eval(loginButtonSelector, el => el.click())
		console.log("* Starting the login process");
		// Log(LOGLEVEL, "* Starting the login process", reqCredentials)
		try {
			await page.waitForSelector(submitLoginSelector, { timeout: 5000 })
		} catch (error) {
			console.log("!! The login form is not available");
			// Log("ERROR", "!! The login form is not available", reqCredentials)
			formAvailable = false
		}
		if (formAvailable) {
			await page.type(emailSelector, taskinfo.account.email)
			await page.type(passwordSelector,  taskinfo.account.password)
			await page.$eval(submitLoginSelector, el => el.click())
			await page.waitForTimeout(2000)
			console.log("* Login success");
			// Log(LOGLEVEL, "* Login success", reqCredentials)
		}

		//* Going to the main page
		await page.goto(taskinfo.url, { waitUntil: "networkidle2" })
		await page.waitForTimeout(2000)

		if (await page.$(contactFormSelector)) {
			console.log("* The form is available, fullfilling the form...");
			// Log(LOGLEVEL, "* The form is available, fullfilling the form...", reqCredentials)
			console.log("taskinfo.messagetext", taskinfo.messagetext)
			console.log("taskinfo.account.username", taskinfo.account.username)
			console.log("taskinfo.account.phone", taskinfo.account.phone)
			await page.type(messageFormSelector,  taskinfo.messagetext)
			await page.type(nameInputSelector,  taskinfo.account.username)
			await page.type(phoneInputSelector,  taskinfo.account.phone)
			console.log("* The form is complete, sending the message...");
			// Log(LOGLEVEL, "* The form is complete, sending the message...", reqCredentials)
			// await page.$eval(submitFormSelector, el => el.click()) //Nachricht senden
			console.log("* The message has sended");
			// Log(LOGLEVEL, "* The message has sended", reqCredentials)
		}

		await handleClose("* Closing the browser")
	}

}
main();

/* const [url, email, password, userName, userPhone, message] = process.argv.slice(2)
const params = [url, email, password, userName, userPhone, message]
//* Validation
const areValids = params.every(val => val !== undefined)
if (areValids && params.length === 6) {
	const args = { url, email, password, userName, userPhone, message }
	main(args)
}else{
	console.log("The arguments are not complete, or in the wrong order (url, email, password, name, phone, message)");
}
 */