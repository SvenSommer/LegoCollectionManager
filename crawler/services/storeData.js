const { default: axios } = require("axios")

async function storeData(url, object, reqCredentials, debug = false) {
	if(debug) {
		console.log({url,object, reqCredentials});
	}
	try {
		let result = await  axios.post(url, object, reqCredentials);
		if (result.data.code != 201) {
			console.log("Error storing: "  + result.data.message)
		}
		if(debug) {
			let  {data} = result
			console.log({object, data});
		}
		return result;
		
	} catch (error) {
		console.log("Error while storeData:"  + error)
	}
	
}
exports.storeData = storeData;
