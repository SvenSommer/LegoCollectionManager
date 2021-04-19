const { default: axios } = require("axios")


async function getData(requestUrl, reqCredentials, debug = false) {
	try {
		let result = await  axios.get(requestUrl, reqCredentials);
		if (result.data.code != 200) {
			console.log("Error getting data:"  + result.data.message)
		}
		if(debug) {
			let  {data} = result
			console.log(data);
		}
		return result;
		
	} catch (error) {
		console.log("Error getting Data:"  + error)
	}
}
exports.getData = getData;
