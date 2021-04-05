import { Response } from 'express';
import connection from "../../../database_connection";
import { ArchiveAndUpdatePriceData } from './archiveAndUpdatePriceData';
import { GetAndInsertPriceData } from './getAndInsertPriceData';

export function UpsertPriceData(partnumber: any, colorid: any, type: any, condition: any, region: any, guide_type: any, res: Response<any, Record<string, any>>, userid: any) {
    const findPriceDataInDB = `SELECT * FROM Pricedata WHERE 
                        no='${partnumber}' AND color_id = ${colorid} AND type = '${type}' 
                        AND new_or_used = '${condition}' AND region = '${region}' AND guide_type = '${guide_type}'`;
    connection.query(findPriceDataInDB, (err, priceresult: any) => {
        if (err) {
            console.log(findPriceDataInDB)
            console.log(err)
            res.json({
                code: 500,
                message: 'Some Error Occurred!',
                //@ts-ignore
                errorMessage: process.env.DEBUG && err
            });}
        else {
            if (priceresult !== 'undefined' && priceresult.length > 0) {
                const { id: priceid } = priceresult[0];
                //console.log(`Price already in Price-Table with id ${priceid}`)
                ArchiveAndUpdatePriceData(priceid, res, priceresult, userid);
            }   else {
                //console.log(`Price not existend in Price Table yet type:${type}, partnumber:${partnumber}, colorid:${colorid}, condition:${condition}, region:${region}, guide_type:${guide_type}, userid: ${userid}`)
                GetAndInsertPriceData(condition, type, partnumber, colorid, region, guide_type, userid, res);
            }
        }
    });
}
