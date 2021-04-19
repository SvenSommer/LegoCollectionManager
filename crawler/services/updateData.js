
const { default: axios } = require("axios")

async function updateData(url,object, reqCredentials, debug = false) {
	try {
		if(debug) {
			console.log("url:" + url )
		}
		let result = await axios.put(url, object, reqCredentials);
		if (result.data.code != 201) {
			console.log("successfully updated: "  + result.data.message)
		}
		if(debug) {
			let  {data} = result
			console.log({url, object, data});
		}
		return result;
		
	} catch (error) {
		console.log("Error while updating Data:"  + error)
	}
}
exports.updateData = updateData;
