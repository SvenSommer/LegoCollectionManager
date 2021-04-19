const { storeData } = require("./storeData")
const { API_URL, API_REQUEST, LOGLEVEL } = require("../index");

async function Log(level, message, reqCredentials) {
	
	if (LOGLEVEL === "INFO" || level === LOGLEVEL) {
		let logentry = {
			componentid: 1,
			level: level,
			message: message,
		}
		await storeData(API_URL + API_REQUEST.OFFER_LOGS, logentry, reqCredentials, false)
	}
}
exports.Log = Log;
