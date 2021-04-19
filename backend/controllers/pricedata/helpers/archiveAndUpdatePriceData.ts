import { Response } from 'express';
import { GlobalVariable } from '../../../config/GlobalVariable';
import connection from "../../../database_connection";
import { GetAndUpdatePriceData } from './getAndUpdatePriceData';
const blApi = require("../../../config/bl.api.js");

export async function ArchiveAndUpdatePriceData(priceid: any, priceresult: any, userid: number): Promise<any> {
    return new Promise(function (resolve, reject) {
        const archiveSQL = `INSERT INTO PriceDataArchive 
        SELECT * FROM Pricedata WHERE id=${priceid}`; //TODO This does not work as expected
        connection.query(archiveSQL, (err) => {
            if (err) {
                console.log(err);
                reject({
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

                const delay = process.env.DELAY_TIME || 100;

                setTimeout(() => {
                    GetAndUpdatePriceData(type, partnumber, con, colorid, region, guide_type, userid, priceid).then(function (data) {
                        if (data) {
                            GlobalVariable.apiCounter--;
                            resolve(data);
                        }
                    }, function (err) {
                        reject(err);
                    });
                }, (GlobalVariable.apiCounter++) * parseInt(delay.toString()));
            }
        });
    });
}
