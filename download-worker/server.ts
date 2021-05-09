import { Application } from "express";
import Express from "express";
import { Login } from "./services/login.service";
import { GetTaskData, ReInitAfterError } from "./services/offer.service";
import { snooze } from "./config/GlobalVariable";

var cluster = require('cluster');
if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function (worker: any, code: any, signal: any) {
        cluster.fork();
    });
}

if (cluster.isWorker) {
    const app: Application = Express();

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server started, PORT:` + process.env.PORT);
        console.log(`Connected to DB`);
        Login("admin", "adminpass").then(data => {
            performSideTasks().then(data => {

            });
        }).catch(error => {
            console.log(error);
        });
    });

    process.on('uncaughtException', async err => {
        // To DO :: Here we can check err and call the delete functions.
        ReInitAfterError();
        console.error('There was an uncaught error' + err);
        await snooze(2000);
        process.exit(1) //mandatory (as per the Node.js docs)
    });

    var performSideTasks = function () {
        return GetTaskData(1).then(async data => {
            // After 1 round of Task Download it will call for second round after 2 seconds.
            await snooze(200);
            return GetTaskData(4).then(async data => {
                // After 1 round of Task Download it will call for second round after 2 seconds.
                await snooze(200);
                performSideTasks();
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        });
    }

}


