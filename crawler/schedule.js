(async () => {
  const fs = require("fs")
  const find = require("find-process")
  const run = require('child_process')
  const { sleep } = require("./utils")
  const MINUTE = 60000 //ms
  const SCRIPT_NAME = "index.js"
  while (true) {
    if (!fs.existsSync("pid.log")) {
      run.fork(SCRIPT_NAME);
    } else {
      const existingPid = fs.readFileSync("pid.log", { encoding: "utf-8" })
      const pidInfo = await find("pid", existingPid)

      if (pidInfo.length === 0) {
        await sleep(45000)
        run.fork(SCRIPT_NAME);
      }
    }
    await sleep(MINUTE)
  }
})()