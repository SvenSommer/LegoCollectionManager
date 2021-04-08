const fs = require("fs")
const { downloadFile } = require("./DownloadFile")
const { storeData } = require("./services/storeData")
const getToken = response => response.headers["set-cookie"][0].split(";")[0];
const toNumber = (arg, defaulvalue = 0) => {
	try {
		return parseInt(arg)
	} catch (error) {
		return defaulvalue
	}
}
const getDiff = (originalobj, newobj) => {
	const ignoreKeys = ["created", "datecreated"]
	const keys = Object.keys(originalobj)
	const changedkeys = []
	for (let key of keys) {
		if(ignoreKeys.includes(key)) continue
		if (originalobj[key] !== newobj[key]) {
			changedkeys.push(key)
		}
	}
	return changedkeys
}
const getDiffImages = (arr1, arr2) => {
	return arr1
		.filter(x => !arr2.includes(x))
		.concat(arr2.filter(x => !arr1.includes(x)));
}
const downloadImages = async (args) => {
	const { images, imageBasePath, offer_id, url, reqCredentials } = args
	if(!fs.existsSync(imageBasePath)) fs.mkdirSync(imageBasePath)
	
	console.log("* Downloading ", images.length, " images")
	for (let i = 0; i < images.length; i++) {
		let imgurl = images[i]
		let extension = imgurl.split(".").pop()
		let imagename = imgurl.split("/")
		imagename.pop()
		imagename = imagename.pop()

		if (!fs.existsSync(imageBasePath + "/" + offer_id)) {
			fs.mkdirSync(imageBasePath + "/" + offer_id)
		}

		const completePath = `${imageBasePath}/${offer_id}/${imagename}.${extension}`
		// console.log({ completePath });
		await downloadFile(imgurl, completePath)
		let offerImage = {
			offer_id: offer_id,
			imageurl: imgurl,
			path: completePath
		}
		await storeData(url, offerImage, reqCredentials)
	}
}
const getFromPreferences = (searchValue, response) => {
	return response.data.result.find(pref => pref.name === searchValue)
}
const areEquals = (obj, newobj) => JSON.stringify(obj) === JSON.stringify(newobj)
module.exports = {
	getToken,
	toNumber,
	getDiff,
	getDiffImages,
	areEquals,
	downloadImages,
	getFromPreferences
}