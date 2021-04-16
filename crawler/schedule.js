// const path = require("path")

// const Bree = require("bree")

// const bree = new Bree({
// 	root: false,
// 	jobs: [
// 		{
// 			name: "test function",
// 			path: path.join(__dirname, "test.js"),
// 			interval: "30 seconds"
// 		}
// 	]
// })
// bree.start()
// for (let i = 0; i < 2; i++) {
// 	require('child_process').fork('test.js');
// }
const psList = require('ps-list');
 
(async () => {
    console.log(await psList());
		(await psList()).reverse()
    //=> [{pid: 3213, name: 'node', cmd: 'node test.js', ppid: 1, uid: 501, cpu: 0.1, memory: 1.5}, …]
})();