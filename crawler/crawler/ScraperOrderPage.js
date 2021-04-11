// =================================================
// * IMPORTS
// =================================================
const { toNumber } = require("../utils")
// const { reqCredentials } = require("../index")
let { LOGLEVEL } = require("../index")
const { Log } = require("../services/log")
LOGLEVEL = LOGLEVEL.toUpperCase()
// =================================================
// * SELECTORS
// =================================================
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
const offerShipingSelector = "ul.addetailslist li:last-of-type span"
const offerDescriptionSelector = "#viewad-description .l-container";

/**
 * This function returns  a object of
 * - offer
 * - user
 * - array of images (urls)
 * - external_id
 * @param {*} args => Object with configuration of the function
 * @returns 
 */
const scraperOrderPage = async (args) => {
	const { browser, url: offerurl, id, location, externalId } = args
	console.log("=================================================")
	// =================================================
	// * Opening the url in another tab
	// =================================================
	const page = await browser.newPage()
	console.log("Opening the offer page: ", offerurl)
	// Log(LOGLEVEL, "Opening the offer page: " + offerurl, reqCredentials)
	try {
		await page.goto(offerurl, { waitUntil: "networkidle2", timeout: 5 * 60 * 1000 })
	} catch (error) {
		console.log("!! This page can't be loaded, SKIP ", offerurl);
		// Log(LOGLEVEL, "!! This page can't be loaded, SKIP " + offerurl, reqCredentials)
		await page.close()
		return {
			deleted_by_user: true
		}
	}
	await page.waitForTimeout(1500)
	if (await page.$(notificationSelector)) {
		await page.$eval(closeNotificationSelector, el => el.click())
	}

	// =================================================
	// * Getting the information from the offer page
	// =================================================
	console.log("* Collecting the information of the offer...")
	// Log(LOGLEVEL, "* Collecting the information of the offer...", reqCredentials)
	console.log("Offer title: ", await page.title())
	// Log(LOGLEVEL, "Offer title: " + await page.title(), reqCredentials)
	const offerUrl = page.url()

	//*Trying to get the title of the offer
	try {
		await page.waitForSelector(offerTitleSelector, { timeout: 15000 })
	} catch (error) {
		console.log("!! Error: Cannot detect the title of the offer, is deleted by user");
		// Log(LOGLEVEL, "!! Error: Cannot detect the title of the offer, maybe is deleted by user", reqCredentials)
		const currentUrl = page.url()
		console.log(currentUrl);
		// Log(LOGLEVEL, currentUrl, reqCredentials)
		// console.log("* Closing the tab")
		// // Log(LOGLEVEL, "* Closing the tab", reqCredentials)
		// await page.close()
		return {
			external_id: externalId,
			deleted_by_user: true
		}

	}

	const offerTitle = await page.$eval(offerTitleSelector, el => el.innerText.trim())
	let offerSubInfo = []
	if (await page.$(offerPriceSelector)) {
		offerSubInfo = await page.$eval(offerPriceSelector, el => el.innerText.trim().split(" "))
	}
	const [offerPrice, offerCurrency, offerPriceType] = offerSubInfo
	const locationInfo = await page.$eval(offerLocationSelector, el => el.innerText.trim().split(" "))
	const offerZipCode = locationInfo[0]
	const offerLocation = locationInfo.join(" ")
	let offerPulicationDate = await page.$eval(offerPublicationDateSelector, el => el.innerText.trim())
	offerPulicationDate = offerPulicationDate.split(".").reverse().join("-") + " " + "00:00:00"
	const offerViews = await page.$eval(offerViewsSelector, el => el.innerText.trim())
	let external_id = await page.$eval(offerIdSelector, el => el.innerText.trim().split(":").pop().trim())
	external_id = toNumber(external_id)
	const offerType = await page.$eval(offerTypeSelector, el => el.innerText.trim())
	const offerShipping = await page.$eval(offerShipingSelector, el => el.innerText.trim())
	// const offerDescription = await page.$eval(offerDescriptionSelector, el => el.innerHTML.trim())
	const offerDescription = await page.evaluate((descriptionSelector) => {
		//* Deleting the title description
		const baseElement = document.querySelector(descriptionSelector)
		//* Deleting the attributes from each element from description
		const allElments = [...baseElement.querySelectorAll("*")]
		const allAttibutes = allElments.map(e => Object.values(e.attributes))
		const attributes = [].concat(...allAttibutes).map(o => o.name)
		const uniqueAttributes = new Set(attributes)
		allElments.forEach(e => {
			uniqueAttributes.forEach(a => {
				if (e.hasAttribute(a)) {
					e.removeAttribute(a)
				}
			})
		})
		return baseElement.innerHTML.trim()
	}, offerDescriptionSelector)

	//* Saving the images urls
	const imagesUrls = await page.$$eval(offerImagesSelector, els => els.map(img => img.src))

	//* Getting the information from the user
	let user_Id = ""
	if (await page.$(userIdSelector)) {
		await page.$eval(userIdSelector, el => el.click())
		console.log("* Reading the user details")
		// Log(LOGLEVEL, "* Reading the user details", reqCredentials)
		await page.waitForSelector(userNameSelector, { timeout: 5000 })
		// const userIdLink = await page.$eval(userIdSelector, el => el.href)
		const urlHandler = new URLSearchParams(new URL(page.url()).search)
		user_Id = urlHandler.get("userId")
		user_Id = toNumber(user_Id, 1)
	}

	//* Preparing the user object
	const userName = await page.$eval(userNameSelector, el => el.innerText.trim())
	const userType = await page.$eval(userTypeSelector, el => el.innerText.trim())
	let offerscount = 1
	try {
		offerscount = await page.$eval(userOffersSelector, el => el.innerText.trim().split(" ")[0])
		offerscount = parseInt(offerscount)
	} catch (error) {
		console.log("Error: ", error.message);
		// Log(LOGLEVEL, "Error: " + error.message, reqCredentials)
	}

	let friendliness = "unknown"
	if (await page.$(userFriendlySelector)) {
		friendliness = await page.$eval(userFriendlySelector, el => el.innerText.trim())
	}
	let satisfaction = "unknown";
	try {
		const satisfaction = await page.$eval(userSatisfactionSelector, el => el.innerText.trim())
	} catch (error) {
		console.log("Error: ", error.message);
		// Log(LOGLEVEL, "Error: " + error.message, reqCredentials)
	}
	let accountcreated = await page.$eval(userCreationDateSelector, el => el.innerText.trim())
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

	// Preparing the offer object
	const offer = {
		external_id: external_id,
		url: offerUrl,
		searchproperties_id: id,
		title: offerTitle,
		price: toNumber(offerPrice, 0) || 0,
		pricetype: offerPriceType || "unknown",
		currency: offerCurrency || "€",
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
	// =================================================
	// * Closing the tab
	// =================================================
	console.log("* Closing the tab")
	// Log(LOGLEVEL, "* Closing the tab", reqCredentials)
	await page.close()
	return {
		offer: offer,
		user: user,
		images: imagesUrls,
		external_id: external_id,
		offerViews
	}
}

module.exports = {
	scraperOrderPage
}