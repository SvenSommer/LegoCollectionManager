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
import expectedset from "./routes/expectedset";
import identifiedimage from "./routes/identiefiedimage";
import identifiedpart from "./routes/identifiedparts";
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
import missingparts from "./routes/missingparts";
import expectedparts from "./routes/expectedpart";
import offers from "./routes/offers";
import offers_images from "./routes/offers_images";
import offers_preferences from "./routes/offers_preferences";
import offers_searchproperties from "./routes/offers_searchproperties";
import offers_users from "./routes/offers_users";
import offers_users_categories from "./routes/offers_users_categories";
import offers_views from "./routes/offers_views";
import offers_status from "./routes/offers_status";
import offers_possiblesets from "./routes/offers_possiblesets";
import offers_properties from "./routes/offers_properties";
import offers_logs from "./routes/offers_logs";
import offers_accounts from "./routes/offers_accounts";
import offers_messages from "./routes/offers_messages";
import offers_messagetexts from "./routes/offers_messagetexts";
import offers_blacklist from "./routes/offers_blacklist";
import task from "./routes/task";

import progress_routes from './routes/progressdetails';

const corsOpts = {
    origin: ['http://localhost:3001', 'http://localhost:4200', 'http://localhost:3002','http://localhost:5000','http://192.168.178.52:4200','http://legosorter:4200'],
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
// app.use(cors());
// app.options("*")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
app.use('/expectedsets', expectedset);
app.use('/identifiedimages', identifiedimage);
app.use('/identifiedparts', identifiedpart);
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
app.use('/missingparts', missingparts);
app.use('/expectedparts', expectedparts);
app.use('/offers', offers);
app.use('/offers_images', offers_images);
app.use('/offers_preferences', offers_preferences);
app.use('/offers_searchproperties', offers_searchproperties);
app.use('/offers_users', offers_users);
app.use('/offers_users_categories', offers_users_categories);
app.use('/offers_views', offers_views);
app.use('/offers_status', offers_status);
app.use('/offers_possiblesets', offers_possiblesets);
app.use('/offers_properties', offers_properties);
app.use('/offers_logs', offers_logs);
app.use('/offers_accounts', offers_accounts);
app.use('/offers_messages', offers_messages);
app.use('/offers_messagetexts', offers_messagetexts);
app.use('/offers_blacklist', offers_blacklist);
app.use('/tasks', task);

app.use('/progressdetails', progress_routes);


const PORT = process.env.PORT || 4000;
connection.getConnection((err) => {
    if (err) throw err;
    app.listen(PORT, () => {
        console.log(`Server started, PORT: ${PORT}`);
        console.log(`Connected to DB`)
    });
})
