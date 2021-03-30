
const urlBase = "http://localhost:3001/users/login"
const axios = require("axios").default
axios.get(urlBase)
	.then(console.log)
	.then(console.error)
