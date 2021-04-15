
const { default: axios } = require("axios")

async function deleteData(url, reqCredentials, debug = false) {
	try {
		if (debug) {
			console.log("url:" + url)
		}
		let result = await axios.delete(url, reqCredentials);
		if (result.data.code != 201) {
			console.log("successfully deleted: " + result.data.code)
		}
		if (debug) {
			let { data } = result
			console.log({ url, data });
		}
		return result;

	} catch (error) {
		console.log("Error while deleting Data:" + error)
	}
}
exports.deleteData = deleteData;
