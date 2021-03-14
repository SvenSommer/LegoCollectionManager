import { Response } from 'express';
import connection from "../../../database_connection";
import { GetAndUpdatePriceData } from './getAndUpdatePriceData';
const blApi = require("../../../config/bl.api.js");

export function ArchiveAndUpdatePriceData(priceid: any, res: Response<any, Record<string, any>>, priceresult: any, userid: number) {
    const archiveSQL = `INSERT INTO PricesArchive 
                        SELECT * FROM Prices WHERE id=${priceid}`; //TODO This does not work as expected
    connection.query(archiveSQL, (err) => {
        if (err) {
            console.log(err);
            res.json({
                code: 500,
                message: 'Some Error Occurred!',
                //@ts-ignore
                errorMessage: process.env.DEBUG && err
            });
            
        }
        else {

            const { no: partnumber } = priceresult[0];
            const { type: type } = priceresult[0];
            const { colorid: colorid } = priceresult[0];
            const { new_or_used: condition } = priceresult[0];
            const { region: region } = priceresult[0];
            const { guide_type: guide_type } = priceresult[0];

            let con = blApi.Condition.Used;
            if (condition != "U")
                con = blApi.Condition.New;

                GetAndUpdatePriceData(type, partnumber, con, colorid, region, guide_type, userid, priceid, res);
        }
    });
}
