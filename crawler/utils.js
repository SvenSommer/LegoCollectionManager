const getToken = response => response.headers["set-cookie"][0].split(";")[0];
module.exports = {
	getToken
}