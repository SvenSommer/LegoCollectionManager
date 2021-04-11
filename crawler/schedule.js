
// const fs = require("fs")
// const cronjob = fs.readFileSync("./cron.txt", {encoding: "utf-8"})
(async () => {
	const getCurrentCron = require("./services/getCurrentCron")
	const Bree = require('bree');
	const path = require("path")
	const cronjob = await getCurrentCron()
	const options = {
		root: path.join(__dirname),
		timeout: 0,
		interval: 0,
		hasSeconds: false,
		defaultExtension: 'js'
	};
	const functtest = () => {
		console.log("inside the func")
	}
	const bree = new Bree({
		...options,
		jobs: [
			{
				name: 'crawler',
				// path: path.join(__dirname, 'index.js'),
				path: functtest,
				interval: '1 min'
			},
			// {
			// 	name: 'crawler',
			// 	path: path.join(__dirname, 'index.js'),
			// 	interval: cronjob
			// }
		]
	});
	bree.start()
	console.log("end");
})()