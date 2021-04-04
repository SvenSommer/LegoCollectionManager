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
// const acceptCookiesSelector = "#gdpr-banner-accept"
const denyCookies = ".Actionarea .button-secondary"

const inputSearchSelector = "#site-search-query"
const submitSearchSelector = "#site-search-submit"

const loginSelector = ".login-overlay"
const closeLoginSelector = ".login-overlay a.overlay-close"

const minPriceSelector = "#srchrslt-brwse-price-min"
const maxPriceSelector = "#srchrslt-brwse-price-max"
const buttonPriceSelector = ".button-iconized"

// const offerPerPageSelector = "li > article a.ellipsis"
const offerPerPageSelector = "#srchrslt-adtable article a"

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
const offerDescriptionSelector = "#viewad-description"

const searchTerm = "lego konvolut"

const URLS = [
	"https://www.ebay-kleinanzeigen.de/",
];

// =================================================
// * Initializing the scrapper
// =================================================
const scrapeOffer = async (url) => {
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
	let requestUrl = API_URL + API_REQUEST.OFFER_PREFS

	//* Getting the image path
	const imageUrlId = 7
	response = await axios.get(requestUrl + "/" + imageUrlId, reqHeader)
	const imageBasePath = response.data.result[0].value.split("/")[1]

	// =================================================
	// * OPENING THE BROWSER
	// =================================================
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

	// =================================================
	// * Opening each offer url in another tab
	// =================================================
	console.log("Opening the offer page: ", url)
	try {
		await page.goto(url, { waitUntil: "networkidle2", timeout: 5 * 60 * 1000 })
	} catch (error) {
		console.log("!! This page can't be loaded, SKIP ", offerPage);
		await page.close()
		await handleClose("* Cannot load the URL")
	}
	await page.waitForTimeout(1500)
	if (await page.$(notificationSelector)) {
		await page.$eval(closeNotificationSelector, el => el.click())
	}

	// =================================================
	// * Getting the information from the offer page
	// =================================================
	console.log("* Collecting the information of the offer...")
	console.log("Offer title: ", await page.title())
	const offerUrl = page.url()

	const offerTitle = await page.$eval(offerTitleSelector, el => el.innerText.trim())
	const offerSubInfo = await page.$eval(offerPriceSelector, el => el.innerText.trim().split(" "))
	const [offerPrice, offerCurrency, offerPriceType] = offerSubInfo
	const locationInfo = await page.$eval(offerLocationSelector, el => el.innerText.trim().split(" "))
	const offerZipCode = locationInfo[0]
	const offerLocation = locationInfo.join(" ")
	let offerPulicationDate = await page.$eval(offerPublicationDateSelector, el => el.innerText.trim())
	offerPulicationDate = offerPulicationDate.split(".").reverse().join("-") + " " + "00:00:00"
	const offerViews = await page.$eval(offerViewsSelector, el => el.innerText.trim())
	const offerId = await page.$eval(offerIdSelector, el => el.innerText.trim().split(":").pop().trim())
	const offerType = await page.$eval(offerTypeSelector, el => el.innerText.trim())
	const offerShipping = await page.$eval(offerShipingSelector, el => el.innerText.trim())
	const offerDescription = await page.$eval(offerDescriptionSelector, el => el.innerText.trim())

	//* Creating the base folder for images
	if (!fs.existsSync(imageBasePath)) {
		fs.mkdirSync(imageBasePath)
	}
	//* Saving the images urls
	const imagesUrls = await page.$$eval(offerImagesSelector, els => els.map(img => img.src))

	//* Getting the information from the user
	let userId = ""
	if (await page.$(userIdSelector)) {
		await page.$eval(userIdSelector, el => el.click())
		console.log("* Reading the user details")
		await page.waitForSelector(userNameSelector, { timeout: 5000 })
		// const userIdLink = await page.$eval(userIdSelector, el => el.href)
		const urlHandler = new URLSearchParams(new URL(page.url()).search)
		userId = urlHandler.get("userId")
	}
	//*Checking if the offer exists 
	// - get the IDBCursor, check if exists and check the diff values betwen each obj
	// - same for images => if I have new url images, update and download


	const offer = {
		external_id: offerId,
		url: offerUrl,
		searchterm_id: 1,//TODO: should be 99
		title: offerTitle,
		price: offerPrice,
		pricetype: offerPriceType,
		// pricetype: 'VB',
		currency: offerCurrency,
		locationgroup: "",
		locality: offerLocation,
		zipcode: offerZipCode,
		datecreated: offerPulicationDate,
		type: offerType,
		shipping: offerShipping,
		userid: userId,
		description: offerDescription,
		// images: imagesUrls
	}

	const userName = await page.$eval(userNameSelector, el => el.innerText.trim())
	const userType = await page.$eval(userTypeSelector, el => el.innerText.trim())
	let offerscount = await page.$eval(userOffersSelector, el => el.innerText.trim().split(" ")[0])
	offerscount = parseInt(offerscount)
	const friendliness = await page.$eval(userFriendlySelector, el => el.innerText.trim())
	const satisfaction = await page.$eval(userSatisfactionSelector, el => el.innerText.trim())
	let accountcreated = await page.$eval(userCreationDateSelector, el => el.innerText.trim())
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
	// console.log({offer});
	result = await axios.post(API_URL + API_REQUEST.OFFERS, offer, reqHeader)
	// console.log(result.data);
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
		// offer_images/12/2021_04_01_image1.JPG
		const completePath = `${imageBasePath}/${order_id}/${today}_image${i}.${extension}`
		// console.log({ completePath });
		// await downloadFile(imgUrl, completePath)
		let offerImage = {
			order_id: order_id,
			imageUrl: imgUrl,
			downloadedpath: completePath
		}
		await axios.post(API_URL + API_REQUEST.OFFERS_IMAGES, offerImage, reqHeader)
	}

	//* Saving the view count
	console.log("* Storing the view count")
	let viewObj = {
		order_id,
		viewcount: offerViews
	}
	await axios.post(API_URL + API_REQUEST.OFFERS_VIEWS, viewObj, reqHeader)

	//* Saving the user information in the DB
	console.log("* Storing the user information...")
	// console.log({
	// 	url: API_URL + API_REQUEST.OFFERS_USER, 
	// 	user, 
	// 	reqHeader
	// });
	result = await axios.post(API_URL + API_REQUEST.OFFERS_USER, user, reqHeader)
	if (result.data.code === 201) {
		console.log(result.data.message)
	}
	console.log({ data: result.data });
	if (debug) offers.push({ user, offer })
	//* Closing the tab
	console.log("* Closing the tab")
	await page.close()
	console.log("Saving the file");
	if (debug) require("fs").writeFileSync("data.json", JSON.stringify(offers, null, 2))
	await handleClose("* Closing the browser")
};


// =================================================
// * MAIN
// =================================================
const offerUrl = process.argv[2]
if (offerUrl) {
	scrapeOffer(offerUrl)
} else {
	console.log("!! You need to provide a valid URL")
	process.exit(1)
}