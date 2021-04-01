const fs = require("fs")
const https = require("https")
const http = require("http")

const { URL } = require("url")
const slug = string => string.replace(/[^0-9a-zA-Z\-]/ig, "_");

const downloadFile = async (url, downloadPath) => {
	
	const urlUser = new URL(url)
	const reqHandler = urlUser.protocol === "http:" ? http : https
	const req = reqHandler.get(url, (res) => {
		// console.log("downloading file");
		const fileStream = fs.createWriteStream(downloadPath)
		res.pipe(fileStream)

		fileStream.on("error", (err) => {
			console.log("Error saving the file")
			console.log(err)
		})

	})

}


module.exports = {
	downloadFile
}