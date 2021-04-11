const { getFromPreferences } = require("../utils")
const { getData } = require("./getData")
const { storeData } = require("./storeData")
const { getToken } = require("../utils")
const fs = require("fs")
const path = require("path")

const USERNAME = "scraper"
const PASSWORD = "pw"
const CREDENTIALS = {
	username: USERNAME,
	password: PASSWORD
}

const getCurrentCron = async () => {
	const host = "http://localhost:3001"
	const loginUrl = "/users/login"
	const preferencesUrl = "/offers_preferences"


	const auth = await storeData(host + loginUrl, CREDENTIALS);
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
	const fileName = path.join(__dirname, "..", "cron.txt")

	const response = await getData(host + preferencesUrl, reqCredentials)
	// const { value: currentCronjob } = response.data.result.find(el => el.name === "active_schedule")
	const { value: currentCronjob } = getFromPreferences("active_schedule", response)
	// fs.writeFileSync(fileName, currentCronjob)
	// console.log("* The job schedule has been created: ", currentCronjob, "(",new Date().toLocaleString(),")");
	
	return currentCronjob
};
module.exports = {
	getCurrentCron
}
// getCurrentCron()

