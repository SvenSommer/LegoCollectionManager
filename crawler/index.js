// =================================================
// * Scrapper variables configuration
// =================================================
const acceptCookiesSelector = "#gdpr-banner-accept"

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
	"https://www.ebay-kleinanzeigen.de/"
];

// =================================================
// * Initializing the scrapper
// =================================================
(async () => {
	// IMPORTS
	const puppeteer = require("puppeteer")
	const { URL, URLSearchParams } = require("url")
	const { userAgents } = require("./userAgents")
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
			"--start-maximized"
		],
		ignoreHTTPSErrors: true,
		// slowMo: 40
	});

	const page = await browser.newPage()
	await page.setCacheEnabled(false)

	// Handling all errors
	const handleClose = async (message = "Closing the browser on unexpected Error") => {
		console.log(message)
		await page.close()
		await browser.close()
		// process.exit(1)
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
		console.log("* Loading the page...")
		await page.waitForTimeout(1000)

		if (await page.$(acceptCookiesSelector)) {
			console.log("* Accepting cookies")
			await page.$eval(acceptCookiesSelector, el => el.click())
		}

		if (await page.$(loginSelector)) {
			await page.$eval(closeLoginSelector, el => el.click())
		}

		console.log("* Introducing the search term: ", searchTerm)
		await page.type(inputSearchSelector, searchTerm)
		await page.$eval(submitSearchSelector, el => el.click())
		await page.waitForTimeout(1500)

		console.log("* Setting the price")
		await page.type(minPriceSelector, "50")
		await page.type(maxPriceSelector, "100")
		await page.$eval(buttonPriceSelector, el => el.click())
		await page.waitForTimeout(2000)

		const offersPerPage = await page.$$eval(offerPerPageSelector, els => els.map(link => link.href))
		if (offersPerPage.length < 0) {
			console.log("!! There are not valid offers, SKIP")
			continue
		}

		console.log(offersPerPage.length, " offers found")

		for (offerPage of offersPerPage) {
			// =================================================
			// * Opening each offer url in another tab
			// =================================================
			const newTab = await browser.newPage()
			const randomAgent = Math.ceil(Math.random() * userAgents.length - 1)
			await newTab.setUserAgent(userAgents[randomAgent])
			await newTab.setViewport({ width: 2200, height: 1080 })
			console.log("Opening the offer page: ", offerPage)
			try {
				await newTab.goto(offerPage, { waitUntil: "networkidle2", timeout: 3 * 60 * 1000 })
			} catch (error) {
				console.log("!! This page can't be loaded, SKIP");
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
			try {
				console.log("Offer title: ", await newTab.title())
				await newTab.waitForSelector(userIdSelector, { timeout: 5000 })
			} catch (error) {
				console.log("!! This page can't be loaded, SKIP");
				await newTab.close()
				continue
			}

			const offerUrl = newTab.url()
			const userIdLink = await newTab.$eval(userIdSelector, el => el.href)
			//* Parsing the url from the user to get the userId
			const urlHandler = new URLSearchParams(new URL(userIdLink).search)
			const userId = urlHandler.get("userId")
			const offerTitle = await newTab.$eval(offerTitleSelector, el => el.innerText.trim())
			const offerSubInfo = await newTab.$eval(offerPriceSelector, el => el.innerText.trim().split(" "))
			const [offerPrice, offerCurrency, offerPriceType] = offerSubInfo
			const locationInfo = await newTab.$eval(offerLocationSelector, el => el.innerText.trim().split(" "))
			const offerZipCode = locationInfo[0]
			const offerLocation = locationInfo.join("")
			const offerPulicationDate = await newTab.$eval(offerPublicationDateSelector, el => el.innerText.trim())
			const offerViews = await newTab.$eval(offerViewsSelector, el => el.innerText.trim())
			const offerId = await newTab.$eval(offerIdSelector, el => el.innerText.trim().split(":").pop())
			const offerType = await newTab.$eval(offerTypeSelector, el => el.innerText.trim())
			const offerShipping = await newTab.$eval(offerShipingSelector, el => el.innerText.trim())
			const offerDescription = await newTab.$eval(offerDescriptionSelector, el => el.innerText.trim())

			const offer = {
				external_id: "",
				url: offerUrl,
				searchterm_id: searchTerm,
				title: offerTitle,
				price: offerPrice,
				pricetype: offerPriceType,
				currency: offerCurrency,
				locationgroup: "the other location from outside",
				locality: offerLocation,
				zipcode: offerZipCode,
				datecreated: offerPulicationDate,
				type: offerType,
				shipping: offerShipping,
				userid: userId,
				description: offerDescription,

				views: offerViews,
				offerId: offerId
			}

			console.log("* Sending the offer to the API")
			offers.push(offer)

			//* Closing the tab
			console.log("* Closing the tab")
			await newTab.close()

		}//offer in offers


	}//url in urls
	console.log("Saving the file");
	require("fs").writeFileSync("data.json", JSON.stringify(offers, null, 2))
	await handleClose("* Closing the browser")
})()