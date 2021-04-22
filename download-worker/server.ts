import { Application } from "express";
import Express from "express";
import { Login } from "./services/login.service";
import { GetTaskData } from "./services/offer.service";
import { snooze } from "./config/GlobalVariable";

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

var performSideTasks = function () {
    return GetTaskData().then(async data => {
        // After 1 round of Task Download it will call for second round after 2 seconds.
        await snooze(2000);
        performSideTasks();
    }).catch(error => {
        console.log(error);
    });
}


