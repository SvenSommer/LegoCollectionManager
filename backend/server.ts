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
import collection from "./routes/collection";

import setdata from "./routes/setdata";
import partdata from "./routes/partdata";
import category from "./routes/category";
import color from "./routes/color";
import partimage from "./routes/partimage";
import pricedata from "./routes/pricedata";
import recognisedset from "./routes/recognisedset";
import recognisedimage from "./routes/recognisedimage";
import recognisedpart from "./routes/recognisedpart";
import run from "./routes/run";
import runstatus from "./routes/runstatus";
import sorter from "./routes/sorter";
import valve from "./routes/valve";
import scale from "./routes/scale";
import pushers from "./routes/pushers";
import status from "./routes/status";
import subsetdata from "./routes/subsetdata";
import suggestedset from "./routes/suggestedset";
import supersetdata from "./routes/supersetdata";
import types from "./routes/types";
import usergroups from "./routes/usergroups";
import sortedsets from "./routes/sortedsets";
import sortedparts from "./routes/sortedparts";


const corsOpts = {
    origin: 'http://localhost:4200',
    credentials: true,
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

/*
* Initializing Middlewares
*/
dotenv.config();
app.use(cors(corsOpts));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/*
* Middleware Routes
*/
app.use('/users', user);
app.use('/collections', collection);
app.use('/setdata', setdata);
app.use('/partdata', partdata);
app.use('/categories', category);
app.use('/colors', color);
app.use('/partimages', partimage);
app.use('/pricedata', pricedata);
app.use('/recognisedsets', recognisedset);
app.use('/recognisedimages', recognisedimage);
app.use('/recognisedparts', recognisedpart);
app.use('/runs', run);
app.use('/runstatus', runstatus);
app.use('/sorters', sorter);
app.use('/valves', valve);
app.use('/scales', scale);
app.use('/pushers', pushers);

app.use('/status', status);
app.use('/subsetdata', subsetdata);
app.use('/suggestedsets', suggestedset);
app.use('/supersetdata', supersetdata);
app.use('/types', types);
app.use('/usergroups', usergroups);
app.use('/sortedsets', sortedsets);
app.use('/sortedparts', sortedparts);


const PORT = process.env.PORT || 4000;
connection.getConnection((err) => {
    if(err) throw err;
    app.listen(PORT, () => {
        console.log(`Server started, PORT: ${PORT}`);
        console.log(`Connected to DB`)
    });
})

