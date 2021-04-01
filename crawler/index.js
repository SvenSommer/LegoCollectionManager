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
	OFFERS_USERS: "/offers_user",
	OFFER_PREFS: "/offers_preferences",
	SEARCH_TERMS: "/offers_searchproperties",
	OFFERS_VIEWS: "/offers_views",
	OFFERS_USER: "/offers_users",
	OFFERS_IMAGES: "/offers_images"
}
// =================================================
// * imports
// =================================================
const { getToken } = require("./utils")
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

const offerPerPageSelector = "li > article a.ellipsis"
// const offerPerPageSelector = "#srchrslt-adtable article a"

const notificationSelector = ".mfp-container"
const closeNotificationSelector = ".mfp-close"

const userIdSelector = ".iconlist-text a"
const userNameSelector = ".userprofile--name"
const userTypeSelector = ".userprofile-details"
const userCreationDateSelector = "section > header > span:nth-child(5)"
const userOffersSelector = "section > header > span:nth-child(7)"
const userSatisfactionSelector = ".badges-iconlist li"
const userFriendlySelector = ".badges-iconlist li:nth-of-type(2)"

const offerImagesSelector = "#viewad-product .galleryimage-element img"
const offerTitleSelector = "#viewad-title"
const offerPriceSelector = "#viewad-price"
const offerLocationSelector = "#viewad-locality"
const offerPublicationDateSelector = "#viewad-extra-info > div"
const offerViewsSelector = "#viewad-cntr"
const offerIdSelector = "#viewad-extra-info div:last-child"
const offerTypeSelector = "ul.addetailslist .addetailslist--detail--value"
const offerShipingSelector = "ul.addetailslist li:last-of-type"
const offerDescriptionSelector = "#viewad-description";

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

	const { URL, URLSearchParams } = require("url")
	const fs = require("fs")
	const { downloadFile } = require("./DownloadFile")
	const { default: axios } = require("axios")

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
	const auth = await axios.post(API_URL + API_REQUEST.AUTH, CREDENTIALS)
	let isAuthenticated = false
	const reqHeader = {
		headers: {
			Cookie: ""
		}
	}
	if (auth.data.code === 200) {
		isAuthenticated = true
		const token = getToken(auth)
		reqHeader.headers.Cookie = token
	}

	if (!isAuthenticated) {
		console.log("!! You are not authenticated")
		process.exit(1)
	}
	//* Getting the base url
	const baseUrlId = 12
	//http://localhost:3001/offers_preferences/12
	let requestUrl = API_URL + API_REQUEST.OFFER_PREFS
	let response = await axios.get(requestUrl + "/" + baseUrlId, reqHeader)
	const baseUrl = response.data.result[0].value

	//* Getting the image path
	const imageUrlId = 7
	response = await axios.get(requestUrl + "/" + imageUrlId, reqHeader)
	const imageBasePath = response.data.result[0].value.split("/")[1]

	//* Getting the search terms
	response = await axios.get(API_URL + API_REQUEST.SEARCH_TERMS, reqHeader)
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
				console.log("=================================================")
				// =================================================
				// * Opening each offer url in another tab
				// =================================================
				const newTab = await browser.newPage()
				console.log("Opening the offer page: ", offerPage)
				try {
					await newTab.goto(offerPage, { waitUntil: "networkidle2", timeout: 5 * 60 * 1000 })
				} catch (error) {
					console.log("!! This page can't be loaded, SKIP ", offerPage);
					await newTab.close()
					continue
				}
				await newTab.waitForTimeout(1500)
				if (await newTab.$(notificationSelector)) {
					await newTab.$eval(closeNotificationSelector, el => el.click())
				}

				// =================================================
				// * Getting the information from the offer page
				// =================================================
				console.log("* Collecting the information of the offer...")
				console.log("Offer title: ", await newTab.title())
				const offerUrl = newTab.url()

				const offerTitle = await newTab.$eval(offerTitleSelector, el => el.innerText.trim())
				const offerSubInfo = await newTab.$eval(offerPriceSelector, el => el.innerText.trim().split(" "))
				const [offerPrice, offerCurrency, offerPriceType] = offerSubInfo
				const locationInfo = await newTab.$eval(offerLocationSelector, el => el.innerText.trim().split(" "))
				const offerZipCode = locationInfo[0]
				const offerLocation = locationInfo.join(" ")
				let offerPulicationDate = await newTab.$eval(offerPublicationDateSelector, el => el.innerText.trim())
				offerPulicationDate = offerPulicationDate.split(".").reverse().join("-") + " " + "00:00:00"
				const offerViews = await newTab.$eval(offerViewsSelector, el => el.innerText.trim())
				const offerId = await newTab.$eval(offerIdSelector, el => el.innerText.trim().split(":").pop().trim())
				const offerType = await newTab.$eval(offerTypeSelector, el => el.innerText.trim())
				const offerShipping = await newTab.$eval(offerShipingSelector, el => el.innerText.trim())
				const offerDescription = await newTab.$eval(offerDescriptionSelector, el => el.innerText.trim())

				//* Creating the base folder for images
				if (!fs.existsSync(imageBasePath)) {
					fs.mkdirSync(imageBasePath)
				}
				//* Saving the images urls
				const imagesUrls = await newTab.$$eval(offerImagesSelector, els => els.map(img => img.src))

				//* Getting the information from the user
				let userId = ""
				if (await newTab.$(userIdSelector)) {
					await newTab.$eval(userIdSelector, el => el.click())
					console.log("* Reading the user details")
					await newTab.waitForSelector(userNameSelector, { timeout: 5000 })
					// const userIdLink = await newTab.$eval(userIdSelector, el => el.href)
					const urlHandler = new URLSearchParams(new URL(newTab.url()).search)
					userId = urlHandler.get("userId")
				}
				//*Checking if the offer exists

				const offer = {
					external_id: offerId,
					url: offerUrl,
					searchterm_id: id,
					title: offerTitle,
					price: offerPrice,
					pricetype: offerPriceType,
					currency: offerCurrency,
					locationgroup: location,
					locality: offerLocation,
					zipcode: offerZipCode,
					datecreated: offerPulicationDate,
					type: offerType,
					shipping: offerShipping,
					userid: userId,
					description: offerDescription,
					// images: imagesUrls
				}

				const userName = await newTab.$eval(userNameSelector, el => el.innerText.trim())
				const userType = await newTab.$eval(userTypeSelector, el => el.innerText.trim())
				const offerscount = await newTab.$eval(userOffersSelector, el => el.innerText.trim())
				const friendliness = await newTab.$eval(userFriendlySelector, el => el.innerText.trim())
				const satisfaction = await newTab.$eval(userSatisfactionSelector, el => el.innerText.trim())
				let accountcreated = await newTab.$eval(userCreationDateSelector, el => el.innerText.trim())
				accountcreated = accountcreated.split(" ")[2].split(".").reverse().join("-") + " " + "00:00:00"
				const user = {
					user_id: userId,
					name: userName,
					type: userType,
					offerscount: offerscount,
					friendliness: friendliness,
					satisfaction: satisfaction,
					accountcreated: accountcreated
				}
				//* Saving the offer in the DB
				let order_id = null
				console.log("* Storing the offer ...")
				result = await axios.post(API_URL + API_REQUEST.OFFERS, offer, reqHeader)
				if (result.data.code === 201) {
					order_id = result.data.order_id
					console.log(result.data.message)
				}

				//* Downloading the images
				console.log("* Downloading ", imagesUrls.length, " images")
				for (let i = 0; i < imagesUrls.length; i++) {
					let imgUrl = imagesUrls[i]
					let extension = imgUrl.split(".").pop()
					let today = new Date().toISOString().split("T")[0].replace(/-/g, "_")
					// if (!fs.existsSync(imageBasePath + "/" + offerId)) {
					// 	fs.mkdirSync(imageBasePath + "/" + offerId)
					// }
					// offer_images/1265/2021_04_01_image1.JPG
					const completePath = `${imageBasePath}/${order_id}/${today}_image${i}.${extension}`
					// console.log({ completePath });
					// await downloadFile(imgUrl, completePath)
					let offerImage = {
						offer_id: offer_id,
						imageUrl: imgUrl,
						downloadedpath: completePath
					}
					await axios.post(API_URL + API_REQUEST.OFFERS_IMAGES, offerImage, reqHeader)
				}

				//* Saving the view count
				console.log("* Storing the view count")
				let viewObj = {
					offer_id,
					viewcount: offerViews
				}
				await axios.post(API_URL + API_REQUEST.OFFERS_VIEWS, viewObj, reqHeader)

				//* Saving the user information in the DB
				console.log("* Storing the user information...")
				result = await axios.post(API_URL + API_REQUEST.OFFERS_USER, user, reqHeader)
				if (result.data.code === 201) {
					console.log(result.data.message)
				}

				console.log("* Sending the offer to the API")
				if (debug) offers.push({ user, offer })

				//* Closing the tab
				console.log("* Closing the tab")
				console.log();
				await newTab.close()

			}//offer in offers
			//* Cleaning the previuous filters
			await page.goto(url)
			await page.waitForTimeout(2500)

		}// for search term in searchTermns

	}//url in urls
	console.log("Saving the file");
	if (debug) require("fs").writeFileSync("data.json", JSON.stringify(offers, null, 2))
	await handleClose("* Closing the browser")
})()

// =================================================
// * TASKS
// =================================================
// - main task: scrape and save to the API reading the API information (searchtermsn)
// - avoid the ban waiting and asking every 10 seconds if i still banned [no need]
// - make another script or function to receives the offer url and store in the API [done]
// - find a good solution to avoid the ban entire [done]
// - if not, possible, write the description [no need]


