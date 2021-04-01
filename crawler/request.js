const getToken = response => response.headers["set-cookie"][0].split(";")[0];

(async () => {
	const urlBase = "http://localhost:3001"
	const axios = require("axios").default
	const username = "scraper";
	const password = "pw"
	const auth = await axios.post(urlBase + "/users/login", { username: username, password: password })
	if (auth.data.code === 200) {
		// =================================================
		// * Getting the credentials for each request
		// =================================================
		const token = getToken(auth)
		const reqHeader = {
			headers: {
				Cookie: token
			}
		}
		// =================================================
		// * Making the requests to the API
		// =================================================
		//* Getting the base URL
		const baseUrlId = 12
		
		let responseApi = await axios.get(`${urlBase}/offers_preferences/${baseUrlId}`,reqHeader)
		// const baseUrl = responseApi.data.result[0].value
		//* Getting the search schedule
		// const passiveScheduleId = 10
		// const responseApi = await axios.get(`${urlBase}offers_preferences/${passiveScheduleId}`,reqHeader)
		// const baseUrl = responseApi.data.result[0].value
		//* Getting searchs terms
		responseApi = await axios.get(`${urlBase}/offers_searchproperties`,reqHeader)
		const searchTerms = responseApi.data.result.filter(offer => offer.active)
		console.log(searchTerms)

	}


})()

// (async () => {
// 	const urlBase = "https://www.ebay-kleinanzeigen.de/s-preis:50:100/lego-konvolut/k0"
// 	const axios = require("axios").default
// 	const cheerio = require("cheerio")

// 	const { data } = await axios.get(urlBase)
// 	const linksSelector = "#srchrslt-adtable article a"
// 	const articlesPerPage = []
// 	let $ = cheerio.load(data)
// 	// console.log($(linksSelector));
// 	$(linksSelector).each((i, e) => {
// 		const link = $(e).attr("href")
// 		articlesPerPage.push("https://www.ebay-kleinanzeigen.de" + link)
// 	})

// 	const userIdSelector = ".iconlist-text a"

// 	const offerImagesSelector = "#viewad-product .galleryimage-element img"
// 	const offerTitleSelector = "#viewad-title"
// 	const offerPriceSelector = "#viewad-price"
// 	const offerLocationSelector = "#viewad-locality"
// 	const offerPublicationDateSelector = "#viewad-extra-info > div"
// 	const offerViewsSelector = "#viewad-cntr"
// 	const offerIdSelector = "#viewad-extra-info div:last-child"
// 	const offerTypeSelector = "ul.addetailslist .addetailslist--detail--value"
// 	const offerShipingSelector = "ul.addetailslist li:last-of-type"
// 	const offerDescriptionSelector = "#viewad-description"

// 	for (const offerPage of articlesPerPage) {
// 		const response = await axios.get(offerPage)
// 		$ = cheerio.load(response.data)
// 		const title = $(offerTitleSelector).text().trim()
// 		console.log({title, offerPage});
// 	}



// })()