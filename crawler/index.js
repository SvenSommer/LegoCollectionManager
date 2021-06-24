// =================================================
// * API CREDENTIALS && CONFIGURATION
// =================================================
const USERNAME = "scraper"
const PASSWORD = "pw"
const CREDENTIALS = {
	username: USERNAME,
	password: PASSWORD
}
let LOGLEVEL = "INFO"
exports.LOGLEVEL = LOGLEVEL
const API_URL = "backend-app:3001"
exports.API_URL = API_URL
const API_REQUEST = {
	AUTH: "/users/login",
	OFFERS: "/offers",
	OFFER_BY_EXTERNALID: "/offers/externalid/",
	OFFERS_USERS: "/offers_user",
	OFFER_PREFS: "/offers_preferences",
	SEARCH_TERMS: "/offers_searchproperties",
	BLACKLISTED_TERMS: "/offers_blacklist",
	OFFERS_VIEWS: "/offers_views",
	OFFERS_USER: "/offers_users",
	OFFERS_IMAGES: "/offers_images",
	OFFER_STATUS: "/offers_status",
	OFFER_LOGS: "/offers_logs",
	DELETE_OFFER: "/offers/byextuser",
	ACCOUNTS: "/offers_accounts/1",
	OFFER_IMAGES_BY_OFFERID : "/offers_images/offer/"

}
exports.API_REQUEST = API_REQUEST

// =================================================
// * imports
// =================================================
const { getToken, toNumber, areEquals, getDiff, getDiffFromArray, downloadImages, getFromPreferences, flatten } = require("./utils")
const { Log } = require("./services/log")
// const toMillis = require("readable-to-ms")
const { deleteData } = require("./services/deleteData")

// =================================================
// * Scrapper variables configuration
// =================================================
const MAX_PAGES = 5
const acceptCookiesSelector = "#gdpr-banner-accept"

const onlyPickUpSelector = "section.browsebox-attribute > div > ul > li:nth-child(2) > a"
const inputSearchSelector = "#site-search-query"
const inputLocationSelector = "#site-search-area"
const submitSearchSelector = "#site-search-submit"

const loginSelector = ".login-overlay"
const closeLoginSelector = ".login-overlay a.overlay-close"

const loginButtonSelector = "#site-signin > nav > ul > li:nth-child(3) > a"
const emailSelector = "#login-email"
const passwordSelector = "#login-password"
const submitLoginSelector = "#login-submit"

const minPriceSelector = "#srchrslt-brwse-price-min"
const maxPriceSelector = "#srchrslt-brwse-price-max"
const buttonPriceSelector = ".button-iconized"

const nextPageSelector = ".pagination .pagination-next"

const offerPerPageSelector = "li > article a.ellipsis";

// scheduleTime = toMillis(scheduleTime)


// =================================================
// * Initializing the scrapper
// =================================================
const main = async () => {
	//Writing the current PID of this script
	const fs = require("fs")
	const currentPid = process.pid.toString()
	fs.writeFileSync("pid.log", currentPid)
	// IMPORTS
	const puppeteer = require('puppeteer-extra')

	// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
	const StealthPlugin = require('puppeteer-extra-plugin-stealth')
	puppeteer.use(StealthPlugin())

	// Add adblocker plugin to block all ads and trackers (saves bandwidth)
	const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
	puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

	// package to translate str to millis

	const { storeData } = require("./services/storeData")
	const { getData } = require("./services/getData")
	const { updateData } = require("./services/updateData")

	//* Crawler
	const { scraperOrderPage } = require("./crawler/ScraperOrderPage")

	const headless = process.argv[2] ? JSON.parse(process.argv[2]) : true
	// Launch browser  & init page
	const browser = await puppeteer.launch({
		headless: headless,
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

	const debug = process.argv.some(arg => arg === "debug")
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
	exports.default = reqCredentials;

	if (!isAuthenticated) {
		console.log("!! You are not authenticated")
		Log(LOGLEVEL, "!! You are not authenticated", reqCredentials)
		process.exit(1)
	}
	//* Making the call to the API preferences
	//* Getting the base url

	let requestUrl = API_URL + API_REQUEST.OFFER_PREFS
	let preferences = await getData(requestUrl, reqCredentials)
	let { value: baseUrl } = getFromPreferences("baseurl", preferences)

	//* Getting the image path
	let { value: imageBasePath } = getFromPreferences("imagebasepath", preferences)
	imageBasePath = imageBasePath.split("/").filter(Boolean)[0]

	//* Getting the user credentials
	let users = await getData(API_URL + API_REQUEST.ACCOUNTS, reqCredentials)
	const { email, password } = users.data.result[0]

	//* Getting the loglevel
	let { value: LOGLEVEL } = getFromPreferences("loglevel", preferences)
	LOGLEVEL = LOGLEVEL.toUpperCase()

	//* Getting the search terms
	response = await getData(API_URL + API_REQUEST.SEARCH_TERMS, reqCredentials)
	//filtering by active => true
	const searchTermns = response.data.result.filter(termn => termn.active)

	//* Getting the Blacklisted words
	response = await getData(API_URL + API_REQUEST.BLACKLISTED_TERMS, reqCredentials)
	//filtering by active => true
	const blacklistedTermns = response.data.result.filter(termn => termn.active)

	// =================================================
	// * OPENING THE BROWSER
	// =================================================
	const page = await browser.newPage()
	// await page.reload()
	// await page.waitForTimeout(2500)
	await page.setCacheEnabled(false)
	await page.setRequestInterception(true);
	await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
	await page.setDefaultTimeout(15 * 60 * 1000)

	// Handling all errors
	const handleClose = async (message = "Closing the browser on unexpected Error") => {
		console.log(message)
		Log("ERROR", message, reqCredentials)
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

	// throw new Error("die")
	// =================================================
	// * CHECKING NEW OFFERS
	// =================================================
	Log(LOGLEVEL, "Going to the url: " + baseUrl, reqCredentials)
	console.log("* Going to the url: ", baseUrl)
	await page.goto(baseUrl, { waitUntil: "networkidle2" })
	await page.waitForTimeout(2000)
	console.log("* Loading the page...")
	Log(LOGLEVEL, "* Loading the page...", reqCredentials)
	// await page.waitForTimeout(1000)
	if (await page.$(acceptCookiesSelector)) {
		console.log("* Accepting cookies")
		Log(LOGLEVEL, "* Accepting cookies", reqCredentials)
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
	Log(LOGLEVEL, "* Starting the login process", reqCredentials)
	try {
		await page.waitForSelector(submitLoginSelector, { timeout: 5000 })
	} catch (error) {
		console.log("!! The login form is not available");
		Log("ERROR", "!! The login form is not available", reqCredentials)
		formAvailable = false
	}
	if (formAvailable) {
		await page.type(emailSelector, email, { delay: 150 })
		await page.type(passwordSelector, password, { delay: 150 })
		await page.$eval(submitLoginSelector, el => el.click())
		console.log("* Sending creds");
		await page.waitForTimeout(2500)

		//if 403 => Go back and make the login again
		if (await page.$(".outcomebox-error")) {
			console.log("!! 403 message, going back to the login");
			await page.goBack({ waitUntil: "networkidle2", timeout: 30000 })
			await page.evaluate((selectors) => {
				selectors.forEach(sel => document.querySelector(sel).value = "")
			}, [emailSelector, passwordSelector])

			console.log("* Fullfilling the credentials");
			await page.type(emailSelector, email, { delay: 150 })
			await page.type(passwordSelector, password, { delay: 150 })
			console.log("* Sending creds");
			await page.$eval(submitLoginSelector, el => el.click())
		}
		await page.waitForTimeout(2000)
		console.log("* Login success");
		Log(LOGLEVEL, "* Login success", reqCredentials)
	}

	//* Going to the main page
	await page.goto(baseUrl, { waitUntil: "networkidle2" })
	await page.waitForTimeout(2000)

	//*Login info
	const loginAs = await page.$eval("#user-email", el => el.innerText.trim())
	console.log("[*] ", loginAs);
	Log(LOGLEVEL, "[*] " + loginAs, reqCredentials)
	// =================================================
	// * Going over the valid search termns
	// =================================================
	for (const term of searchTermns) {
		const { id, searchterm, location, pricemin, pricemax, onlypickup } = term

		console.log();
		console.log("* Introducing the search term: ", searchterm)
		Log(LOGLEVEL, "* Introducing the search term: ", reqCredentials)
		await page.type(inputSearchSelector, searchterm, { delay: 100 })
		console.log("* Introducing the location: ", location)
		Log(LOGLEVEL, "* Introducing the location: ", reqCredentials)
		await page.type(inputLocationSelector, location, { delay: 100 })
		await page.$eval(submitSearchSelector, el => el.click())
		await page.waitForTimeout(3500)

		if (onlypickup && await page.$(onlyPickUpSelector)) {
			console.log("* Clicking on only pick up option...")
			Log(LOGLEVEL, "* Clicking on only pick up option...", reqCredentials)
			await page.$eval(onlyPickUpSelector, el => el.click())
			await page.waitForTimeout(1500)
		}

		if (pricemin && pricemax) {
			console.log("* Setting the price", [pricemin, pricemax])
			Log(LOGLEVEL, "* Setting the price: " + pricemin + ", " + pricemax, reqCredentials)
			await page.type(minPriceSelector, pricemin.toString(), { delay: 100 })
			await page.type(maxPriceSelector, pricemax.toString(), { delay: 100 })
			await page.$eval(buttonPriceSelector, el => el.click())
			await page.waitForTimeout(2000)
		}

		let currentPage = 1
		let offersPerPage = []
		//* Collecting the offers urls over the multiple pages (pagination)
		console.log("* Going over the pagination...");
		while ((await page.$(nextPageSelector) !== null) && currentPage <= MAX_PAGES) {
			let offersLinks = await page.$$eval(offerPerPageSelector, els => els.map(link => link.href))
			offersPerPage.push(offersLinks)
			await page.$eval(nextPageSelector, el => el.click())
			await page.waitForTimeout(1500)
			currentPage++
		}

		if (offersPerPage.length <= 0) {
			console.log("!! There are not valid offers, SKIP")
			Log(LOGLEVEL, "!! There are not valid offers, SKIP", reqCredentials)
			continue
		}
		offersPerPage = flatten(offersPerPage)

		console.log(offersPerPage.length, " offers found")
		Log(LOGLEVEL, offersPerPage.length + " offers found", reqCredentials)

		for (const offerPage of offersPerPage) {

			//*Scrapper configuration
			const scraperobject = {
				browser: browser,
				url: offerPage,
				id: id,
				location: location,
				blacklistedTermns: blacklistedTermns
			}
			const scraperesult = await scraperOrderPage(scraperobject)
			const { external_id, blacklistetterm } = scraperesult
			if(blacklistetterm) {
				console.log(`!! Offer contains Blacklisted Term ${blacklistetterm}, SKIP`);
				continue;
			}
			//*Checking if the offer exists
			resultofferexisting = await getData(API_URL + API_REQUEST.OFFER_BY_EXTERNALID + external_id, reqCredentials)
			// If the offer exists
			if (resultofferexisting.data.result && resultofferexisting.data.result.length > 0) {
				//* Checking if the objects are equals between each other
				const resultofferexistingofferinfo = resultofferexisting.data.result[0].offerinfo
				let offer_id = resultofferexistingofferinfo.id;
				const resultimagesexistingresponse = await getData(API_URL + API_REQUEST.OFFER_IMAGES_BY_OFFERID + offer_id, reqCredentials)
				//skiping because of empty array
				if(resultimagesexistingresponse.data.result.length <= 0) continue
				const resultimagesexisting = resultimagesexistingresponse.data.result[0].images;
				const imagesurls = resultimagesexisting.length > 0 ? resultimagesexisting.map(img => img.imageurl) : []
				const newoffer = scraperesult.offer
				const images = scraperesult.images
				const diffimages = getDiffFromArray(imagesurls, images)

				if (!areEquals(resultofferexistingofferinfo, newoffer)) {
					let offer_id = resultofferexistingofferinfo.id;
					const offerViews = scraperesult.offerViews
					const updatedKeys = getDiff(resultofferexistingofferinfo, newoffer)
					newoffer["id"] = offer_id
					//* Saving the view count
					console.log("* Adding new view count")
					Log(LOGLEVEL, "* Adding new view count", reqCredentials)
					let object = {
						offer_id,
						viewcount: offerViews
					}
					let url = API_URL + API_REQUEST.OFFERS_VIEWS;
					await storeData(url, object, reqCredentials)

					//*Updating the offer
					let storePropertiesResult = await updateData(API_URL + API_REQUEST.OFFERS + "/" + offer_id, newoffer, reqCredentials)
					// console.log({res: storePropertiesResult.data});

					//*Setting the status for changes
					for (const updatedelement of updatedKeys) {
						if (updatedelement === "id" || updatedelement === "deletedByExtUser") continue
						let status = {
							offer_id: offer_id,
							status: "updated " + updatedelement
						}
						let offerresult = await storeData(API_URL + API_REQUEST.OFFER_STATUS, status, reqCredentials)
						console.log("+ Updating ", updatedelement);
						Log(LOGLEVEL, "+ Updating " + updatedelement, reqCredentials)
					}

					if (diffimages.length > 0) {
						const objDownloadImages = {
							images: diffimages,
							imageBasePath,
							offer_id,
							url: API_URL + API_REQUEST.OFFERS_IMAGES,
							reqCredentials
						}
						let status = {
							offer_id: offer_id,
							status: "updated images"
						}
						await downloadImages(objDownloadImages)
						await storeData(API_URL + API_REQUEST.OFFER_STATUS, status, reqCredentials)
						console.log(`+ Added ${diffimages.length} new images`)
						Log(LOGLEVEL, `+ Added ${diffimages.length} new images`, reqCredentials)
					}
				}
			} else {
				// objects to store
				const { offer, user, images, offerViews } = scraperesult
				//* Saving the offer in the DB
				let offerresult = await storeData(API_URL + API_REQUEST.OFFERS, offer, reqCredentials)
				let offer_id = null
				if (offerresult.data.code === 201) {
					offer_id = offerresult.data.offer_id
					// console.log(offerresult.data.message)
					// Log(LOGLEVEL, "", reqCredentials)
				}

				if (offer_id == null) {
					await handleClose("Error: unable to receive offer_id");
				}

				//* Saving the view count
				console.log("* Storing the view count")
				Log(LOGLEVEL, "* Storing the view count", reqCredentials)
				let object = {
					offer_id,
					viewcount: offerViews
				}
				let url = API_URL + API_REQUEST.OFFERS_VIEWS;
				await storeData(url, object, reqCredentials)

				//* Saving the user information in the DB
				console.log("* Storing the user information...")
				Log(LOGLEVEL, "* Storing the user information...", reqCredentials)
				let userresponse = await storeData(API_URL + API_REQUEST.OFFERS_USER, user, reqCredentials)
				// console.log({res: userresponse.data, user});

				//* Saving the status infor that we created a new offer
				console.log("* Storing the status of offer creation...")
				Log(LOGLEVEL, "* Storing the status of offer creation...", reqCredentials)
				let status = {
					offer_id: offer_id,
					status: "offer created"
				}
				await storeData(API_URL + API_REQUEST.OFFER_STATUS, status, reqCredentials)

				//* Saving the images
				const objDownloadImages = {
					images: images,
					imageBasePath,
					offer_id,
					url: API_URL + API_REQUEST.OFFERS_IMAGES,
					reqCredentials
				}
				await downloadImages(objDownloadImages)
			}

		}//offer in offers
		//* Cleaning the previuous filters
		await page.goto(baseUrl)
		await page.waitForTimeout(2500)

	}// for search term in searchTermns

	console.log();
	console.log("================================================= X =================================================");
	console.log();
	// =================================================
	// * CHECKING OFFERS FROM DATABASE
	// =================================================
	const localOfferUrls = []
	//* Getting all the offers from the database
	let { data: localOffers } = await getData(API_URL + API_REQUEST.OFFERS, reqCredentials)
	localOffers = localOffers.result.filter(offer => offer.deletedByExtUser === null && offer.deleted === null).map(offer => ({ offer: offer.offerinfo }))
	// console.log({ localOffers });
	//* Checking the offers from yesterday
	console.log("* Checking ", localOffers.length, " offers")
	Log(LOGLEVEL, "* Checking " + localOffers.length + " offers", reqCredentials)
	for (const { offer } of localOffers) {
		let { url, searchproperties_id, locationgroup, external_id, id } = offer
		//*Scrapper configuration
		const scraperobject = {
			browser: browser,
			url: url,
			id: searchproperties_id,
			location: locationgroup,
			externalId: external_id,
			blacklistedTermns : blacklistedTermns
		}
		localOfferUrls.push(url)
		const scraperesult = await scraperOrderPage(scraperobject)
		const { deleted_by_user } = scraperesult
		if (deleted_by_user) {
			console.log("# Updating the offer " + external_id + " [" + id + "] " + ", is not longer available")
			// console.log({ external_id, deleted_by_user });
			Log(LOGLEVEL, "# Updating the offer, is not longer available", reqCredentials)
			await deleteData(API_URL + API_REQUEST.DELETE_OFFER + "/" + id, reqCredentials)
			// console.log(offer);
		}
	} //url in localoffers

	await handleClose("* Closing the browser")
}

main()
