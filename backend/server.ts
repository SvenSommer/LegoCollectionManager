import Express, { Application } from 'express';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import connection from "./database_connection";
import dotenv from 'dotenv';
const app: Application = Express();


/*
* Importing Routes
*/
import user from "./routes/user";

/*
* Initializing Middlewares
*/
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/*
* Middleware Routes
*/
app.use('/user', user);

connection.getConnection((err) => {
    if(err) throw err;
    app.listen(process.env.PORT, () => {
        console.log(`Server started, PORT: ${process.env.PORT}`);
        console.log(`Connected to DB`)
    });
})

