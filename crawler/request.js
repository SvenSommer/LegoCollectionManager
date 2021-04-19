const getToken = response => response.headers["set-cookie"][0].split(";")[0];

const urlBase = "http://localhost:3001/"
const axios = require("axios").default
const username = "scraper";
const password = "pw"
axios.post(urlBase + "users/login",{ username: username, password: password })
	.then(console.log)
	.then(console.error)


axios.get(urlBase + "users")
	.then(console.log)
	.then(console.error)
	.then((response) => {
		console.log(response.data);
		console.log(response.status);
		console.log(response.statusText);
		console.log(response.headers);
		console.log(response.config);
	  });
