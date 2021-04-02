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
	const { storeData } = require("./services/storeData")
	const { getData } = require("./services/getData")
	const { updateData } = require("./services/updateData")

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
	//* Getting the base url
	// TODO: Make this a query on the "name" of th property
	const baseUrlId = 12
	//http://localhost:3001/offers_preferences/12
	let requestUrl = API_URL + API_REQUEST.OFFER_PREFS
	let response = await getData(requestUrl + "/" + baseUrlId, reqCredentials)
	const baseUrl = response.data.result[0].value

	//* Getting the image path
	// TODO: Make this a query on the "name" of th property
	const imageUrlId = 7
	response = await getData(requestUrl + "/" + imageUrlId, reqCredentials)
	const imageBasePath = response.data.result[0].value.split("/")[1]

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
				//TODO: please put tius is a function scrapeOrderpage with the resultobjects of user, offer, etc. to store
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
				const external_id = await newTab.$eval(offerIdSelector, el => el.innerText.trim().split(":").pop().trim())
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
				let user_Id = ""
				if (await newTab.$(userIdSelector)) {
					await newTab.$eval(userIdSelector, el => el.click())
					console.log("* Reading the user details")
					await newTab.waitForSelector(userNameSelector, { timeout: 5000 })
					// const userIdLink = await newTab.$eval(userIdSelector, el => el.href)
					const urlHandler = new URLSearchParams(new URL(newTab.url()).search)
					user_Id = urlHandler.get("userId")
					//*Parsing the user id 
					try {
						user_Id = Number(user_Id)
					} catch (error) {
						user_Id = 1
					}
				}

				// store the offer in DB (ccreate the function)
				const offer = {
					external_id: external_id,
					url: offerUrl,
					searchproperties_id: id,
					title: offerTitle,
					price: offerPrice || 0,
					pricetype: offerPriceType || "unknown",
					currency: offerCurrency,
					locationgroup: location,
					locality: offerLocation,
					zipcode: offerZipCode,
					datecreated: offerPulicationDate,
					type: offerType,
					shipping: offerShipping,
					user_id: user_Id,
					description: offerDescription,
					// images: imagesUrls
				}
				
				//*Checking if the offer exists
				//TODO: Check if the offer prperties have changes -> store changes, store "changed {{description}}" info in status endpoint
				//TODO: Check if the images of the offer have new images -> store new images, store change "added image" in status endpoint

				resultofferexisting = await getData(API_URL + API_REQUEST.OFFER_BY_EXTERNALID + external_id, reqCredentials)
				//console.log(resultofferexisting.data)
				if (resultofferexisting.data.result.length > 0) {
					//TODO: move this code for handling a exisiting offer to a new function and file
					console.log("==== CHECK FOR UPDATES OF EXISTING OFFER", external_id);
					let updatedProperties = [];
					resultofferexistingofferinfo = resultofferexisting.data.result[0].offerinfo
					let offer_id = resultofferexistingofferinfo.id;

					//TODO: FInd the changes between object from the databses und current scraped object for properties, if there are changes set e.g. updatedProperties.push("price")
						//if(JSON.stringify() === JSON.stringify)
					
					//TODO: thow away this code 
					//THROW AWAYCODE START: Introducing a change
						console.log("* changed the price by THROW AWAYCODE")
						resultofferexistingofferinfo.price++
						updatedProperties.push("price")
					//THROW AWAYCODE END: Introducing a change

					// If there are changes in props use update offer request
					if(updatedProperties.length > 0)	{
						console.log("==== UPDATING PROPERTIES OF OFFER", external_id);
						storePropertiesResult = await updateData(API_URL + API_REQUEST.OFFERS + "/" + offer_id , resultofferexistingofferinfo, reqCredentials);
						for (const updatedelement of updatedProperties){
							let status = {
								offer_id: offer_id,
								status: "updated " + updatedelement
							}
							var offerresult = await storeData(API_URL + API_REQUEST.OFFER_STATUS, status, reqCredentials)
						};
					}

					//TODO: Find new images and store them 
					resultofferexistingimages = resultofferexisting.data.result[0].images


					//* Closing the tab
					console.log("* Closing the tab")
					console.log();
					await newTab.close()

				} else {

					console.log("===== SAVING NEW OFFER");
					const userName = await newTab.$eval(userNameSelector, el => el.innerText.trim())
					const userType = await newTab.$eval(userTypeSelector, el => el.innerText.trim())
					const offerscount = 1
					try {
						offerCount = await newTab.$eval(userOffersSelector, el => el.innerText.trim().split(" ")[0])
						offerCount = parseInt(offerCount)
					} catch (error) {
						console.log("Error: ", error.message);
					}

					const friendliness = await newTab.$eval(userFriendlySelector, el => el.innerText.trim())
					const satisfaction = await newTab.$eval(userSatisfactionSelector, el => el.innerText.trim())
					let accountcreated = await newTab.$eval(userCreationDateSelector, el => el.innerText.trim())
					accountcreated = accountcreated.split(" ")[2].split(".").reverse().join("-") + " " + "00:00:00"
					const user = {
						user_id: user_Id,
						name: userName,
						type: userType,
						offerscount: offerscount,
						friendliness: friendliness,
						satisfaction: satisfaction,
						accountcreated: accountcreated
					}
					//* Saving the offer in the DB
					
					offerresult = await storeData(API_URL + API_REQUEST.OFFERS, offer, reqCredentials, true)
					let offer_id = null
					if (offerresult.data.code === 201) {
						offer_id = offerresult.data.offer_id
						console.log(offerresult.data.message)
					}

					if (offer_id == null) {
						await handleClose("Error: unable to receive offer_id");
					}

					//* Downloading the images
					console.log("* Downloading ", imagesUrls.length, " images")
					for (let i = 0; i < imagesUrls.length; i++) {
						let imgurl = imagesUrls[i]
						let extension = imgurl.split(".").pop()
						let imagename = imgurl.split("/")
						imagename.pop()
						imagename = imagename.pop()

						if (!fs.existsSync(imageBasePath + "/" + offer_id)) {
							fs.mkdirSync(imageBasePath + "/" + offer_id)
						}

						const completePath = `${imageBasePath}/${offer_id}/${imagename}.${extension}`
						console.log({ completePath });
						await downloadFile(imgurl, completePath)
						let offerImage = {
							offer_id: offer_id,
							imageurl: imgurl,
							path: completePath
						}
						await storeData(API_URL + API_REQUEST.OFFERS_IMAGES, offerImage, reqCredentials)
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
					var offerresult = await storeData(API_URL + API_REQUEST.OFFERS_USER, user, reqCredentials)

					//* Saving the status infor that we created a new offer
					console.log("* Storing the status of offer creation...")
					let status = {
						offer_id: offer_id,
						status: "offer created"
					}
					var offerresult = await storeData(API_URL + API_REQUEST.OFFER_STATUS, status, reqCredentials)

					console.log("* Sending the offer to the API")
					if (debug) offers.push({ user, offer })

					//* Closing the tab
					console.log("* Closing the tab")
					console.log();
					await newTab.close()
				}

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



