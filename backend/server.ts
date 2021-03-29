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
import offers from "./routes/offers";
import offers_images from "./routes/offers_images";
import offers_preferences from "./routes/offers_preferences";
import offers_searchproperties from "./routes/offers_searchproperties";
import offers_users from "./routes/offers_users";
import offers_views from "./routes/offers_views";
import offers_status from "./routes/offers_status";


const corsOpts = {
    origin: 'http://localhost:4200',
    credentials: true,
    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH'
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
app.use('/offers', offers);
app.use('/offers_images', offers_images);
app.use('/offers_preferences', offers_preferences);
app.use('/offers_searchproperties', offers_searchproperties);
app.use('/offers_users', offers_users);
app.use('/offers_views', offers_views);
app.use('/offers_status', offers_status);


const PORT = process.env.PORT || 4000;
connection.getConnection((err) => {
    if(err) throw err;
    app.listen(PORT, () => {
        console.log(`Server started, PORT: ${PORT}`);
        console.log(`Connected to DB`)
    });
})

