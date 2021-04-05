// =================================================
// * API CREDENTIALS && CONFIGURATION
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
	OFFERS: "/offers",
	OFFER_BY_EXTERNALID: "/offers/externalid/",
	OFFERS_USERS: "/offers_user",
	OFFER_PREFS: "/offers_preferences",
	SEARCH_TERMS: "/offers_searchproperties",
	OFFERS_VIEWS: "/offers_views",
	OFFERS_USER: "/offers_users",
	OFFERS_IMAGES: "/offers_images",
	OFFER_STATUS: "/offers_status"

}


// =================================================
// * imports
// =================================================
const { getToken, toNumber, areEquals, getDiff, getDiffImages, downloadImages } = require("./utils")
// =================================================
// * Scrapper variables configuration
// =================================================
const ONE_MINUTE = 60 * 1000
const acceptCookiesSelector = "#gdpr-banner-accept"
const denyCookies = ".Actionarea .button-secondary"

const onlyPickUpSelector = "section.browsebox-attribute > div > ul > li:nth-child(2) > a"
const inputSearchSelector = "#site-search-query"
const inputLocationSelector = "#site-search-area"
const submitSearchSelector = "#site-search-submit"

const loginSelector = ".login-overlay"
const closeLoginSelector = ".login-overlay a.overlay-close"

const minPriceSelector = "#srchrslt-brwse-price-min"
const maxPriceSelector = "#srchrslt-brwse-price-max"
const buttonPriceSelector = ".button-iconized"

const offerPerPageSelector = "li > article a.ellipsis";
// const offerPerPageSelector = "#srchrslt-adtable article a"

// =================================================
// * Initializing the scrapper
// =================================================
(async () => {
	// IMPORTS
	const puppeteer = require('puppeteer-extra')

	// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
	const StealthPlugin = require('puppeteer-extra-plugin-stealth')
	puppeteer.use(StealthPlugin())

	// Add adblocker plugin to block all ads and trackers (saves bandwidth)
	const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
	puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

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
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
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

	if (!isAuthenticated) {
		console.log("!! You are not authenticated")
		process.exit(1)
	}
	//* Making the call to the API preferences
	//* Getting the base url

	let requestUrl = API_URL + API_REQUEST.OFFER_PREFS
	let preferences = await getData(requestUrl, reqCredentials)
	let { value: baseUrl } = preferences.data.result.find(pref => pref.name === "baseurl")

	//* Getting the image path

	preferences = await getData(requestUrl, reqCredentials)

	let { value: imageBasePath } = preferences.data.result.find(pref => pref.name === "imagebasepath")
	imageBasePath = imageBasePath.split("/").filter(Boolean)[0]

	//* Getting the search terms
	response = await getData(API_URL + API_REQUEST.SEARCH_TERMS, reqCredentials)
	//filtering by active => true
	const searchTermns = response.data.result.filter(termn => termn.active)

	const URLS = [
		baseUrl
	];

	// =================================================
	// * OPENING THE BROWSER
	// =================================================
	// const context = await browser.createIncognitoBrowserContext()
	// const page = await context.newPage();
	const page = await browser.newPage()
	await page.setCacheEnabled(false)
	await page.setRequestInterception(true);
	// await page.setUserAgent(userAgent.getRandom())
	await page.setDefaultTimeout(15 * 60 * 1000)

	// Handling all errors
	const handleClose = async (message = "Closing the browser on unexpected Error") => {
		console.log(message)
		for (const page of await browser.pages()) {
			await page.close()
		}
		await browser.close()
		process.exit(1)
	}

	// process.on("uncaughtException", (e) => {
	// 	handleClose(`Uncaught Exception ${e.message}`)
	// })

	// process.on("unhandledRejection", (e) => {
	// 	//e.stack returns the line of the script with the error
	// 	handleClose(`Request exception: ${e.message} - Line:${e.stack}`)
	// })

	const offers = []
	//Should catch here the other urls from services
	for (const url of URLS) {
		// =================================================
		// * Going to the url
		// =================================================
		console.log("* Going to the url: ", url)
		await page.goto(url, { waitUntil: "networkidle2" })
		await page.waitForTimeout(2000)
		console.log("* Loading the page...")
		// await page.waitForTimeout(1000)
		if (await page.$(acceptCookiesSelector)) {
			console.log("* Accepting cookies")
			await page.$eval(acceptCookiesSelector, el => el.click())
			await page.waitForTimeout(2500)
		}

		await page.waitForTimeout(1500)
		if (await page.$(loginSelector)) {
			await page.$eval(closeLoginSelector, el => el.click())
		}

		// =================================================
		// * Going over the valid search termns
		// =================================================
		for (const term of searchTermns) {
			const { id, searchterm, location, pricemin, pricemax, onlypickup } = term

			console.log();
			console.log("* Introducing the search term: ", searchterm)
			await page.type(inputSearchSelector, searchterm, { delay: 100 })
			console.log("* Introducing the location: ", location)
			await page.type(inputLocationSelector, location, { delay: 100 })
			await page.$eval(submitSearchSelector, el => el.click())
			await page.waitForTimeout(3500)

			if (onlypickup && await page.$(onlyPickUpSelector)) {
				console.log("* Clicking on only pick up option...")
				await page.$eval(onlyPickUpSelector, el => el.click())
				await page.waitForTimeout(1500)
			}

			if (pricemin && pricemax) {
				console.log("* Setting the price", [pricemin, pricemax])
				await page.type(minPriceSelector, pricemin.toString(), { delay: 100 })
				await page.type(maxPriceSelector, pricemax.toString(), { delay: 100 })
				await page.$eval(buttonPriceSelector, el => el.click())
				await page.waitForTimeout(2000)
			}

			const offersPerPage = await page.$$eval(offerPerPageSelector, els => els.map(link => link.href))
			if (offersPerPage.length <= 0) {
				console.log("!! There are not valid offers, SKIP")
				continue
			}

			console.log(offersPerPage.length, " offers found")

			for (const offerPage of offersPerPage) {

				//*Scrapper configuration
				const scraperobject = {
					browser: browser,
					url: offerPage,
					id: id,
					location: location
				}
				const scraperesult = await scraperOrderPage(scraperobject)
				const { external_id } = scraperesult
				//*Checking if the offer exists
				resultofferexisting = await getData(API_URL + API_REQUEST.OFFER_BY_EXTERNALID + external_id, reqCredentials)
				// If the offer exists
				if (resultofferexisting.data.result.length > 0) {
					//* Checking if the objects are equals between each other
					const resultofferexistingofferinfo = resultofferexisting.data.result[0].offerinfo
					const resultimagesexisting = resultofferexisting.data.result[0].images.filter(Boolean)
					const imagesurls = resultimagesexisting.length > 0 ? resultimagesexisting.map(img => img.imageurl) : []

					const newoffer = scraperesult.offer
					const images = scraperesult.images
					const diffimages = getDiffImages(imagesurls, images)
					
					if (!areEquals(resultofferexistingofferinfo, newoffer)) {
						let offer_id = resultofferexistingofferinfo.id;
						const updatedKeys = getDiff(resultofferexistingofferinfo, newoffer)
						newoffer["id"] = offer_id

						//*Updating the offer
						let storePropertiesResult = await updateData(API_URL + API_REQUEST.OFFERS + "/" + offer_id, newoffer, reqCredentials)
						// console.log({res: storePropertiesResult.data});
						//*Setting the status for changes
						for (const updatedelement of updatedKeys) {
							if (updatedelement === "id") continue
							let status = {
								offer_id: offer_id,
								status: "updated " + updatedelement
							}
							let offerresult = await storeData(API_URL + API_REQUEST.OFFER_STATUS, status, reqCredentials)
							console.log("+ Updating ", updatedelement);
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
							console.log("+ Updating images")
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
					}

					if (offer_id == null) {
						await handleClose("Error: unable to receive offer_id");
					}

					//* Saving the view count
					console.log("* Storing the view count")
					let object = {
						offer_id,
						viewcount: offerViews
					}
					let url = API_URL + API_REQUEST.OFFERS_VIEWS;
					await storeData(url, object, reqCredentials)

					//* Saving the user information in the DB
					console.log("* Storing the user information...")
					let userresponse = await storeData(API_URL + API_REQUEST.OFFERS_USER, user, reqCredentials)
					// console.log({res: userresponse.data, user});

					//* Saving the status infor that we created a new offer
					console.log("* Storing the status of offer creation...")
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
			await page.goto(url)
			await page.waitForTimeout(2500)

		}// for search term in searchTermns

	}//url in urls
	// console.log("Saving the file");
	// if (debug) require("fs").writeFileSync("data.json", JSON.stringify(offers, null, 2))
	await handleClose("* Closing the browser")
})()

//TODO: Mark offers no longer existing as deleted at the end of a complete run
//1. Get all stored offers by
//resultoffers await getData(API_URL + API_REQUEST.offer, reqCredentials)
//2. check in the list of the external_ids from the last completed runs, which Ids did not appear any longer
//3. Set those disappeard as deleted by (using the offer_id here!!)
/* let status = {
	offer_id: offer_id,
	status: "offer created"
}
var offerresult = await storeData(API_URL + API_REQUEST.OFFER_STATUS, status, reqCredentials) */

// TODO: Implement logger in database
// TODO: 1. run stable for a "unlimited" time
// 			2. accept configuration/schedule changes without manual restarting.


