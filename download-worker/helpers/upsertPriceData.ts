import { Response } from 'express';
import { rejects } from 'node:assert';
import { resolve } from 'node:path';
import { GlobalVariable } from '../config/GlobalVariable';
import connection from "../database_connection";
import { ArchiveAndUpdatePriceData } from './archiveAndUpdatePriceData';
import { GetAndInsertPriceData } from './getAndInsertPriceData';

export async function UpsertPriceData(partnumber: any, colorid: any, type: any, condition: any, region: any, guide_type: any, userid: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        const findPriceDataInDB = `SELECT * FROM Pricedata WHERE 
                        no='${partnumber}' AND color_id = ${colorid} AND type = '${type}' 
                        AND new_or_used = '${condition}' AND region = '${region}' AND guide_type = '${guide_type}'`;
        connection.query(findPriceDataInDB, async (err: any, priceresult: any) => {
            if (err) {
                console.log(findPriceDataInDB)
                console.log(err)
                reject({
                    code: 500,
                    message: 'Some Error Occurred!',
                    //@ts-ignore
                    errorMessage: process.env.DEBUG && err
                });
            }
            else {
                if (priceresult !== 'undefined' && priceresult.length > 0) {
                    const { id: priceid } = priceresult[0];
                    if(process.env.DEBUG == "True") console.log(`Price already in Price-Table with id ${priceid}`)
                    ArchiveAndUpdatePriceData(priceid, priceresult, userid).then(function (data) {
                        if (data) {
                            resolve(data);
                        }
                    }, function (err) {
                        reject(err);
                    });

                } else {
                    if(process.env.DEBUG == "True") console.log(`Price not existend in Price Table yet type:${type}, partnumber:${partnumber}, colorid:${colorid}, condition:${condition}, region:${region}, guide_type:${guide_type}, userid: ${userid}`)
                    const delay = process.env.DELAY_TIME || 100;
                    setTimeout(async () => {
                        GetAndInsertPriceData(condition, type, partnumber, colorid, region, guide_type, userid).then(function (data) {
                            GlobalVariable.apiCounter--;
                            if (data) {
                                resolve(data);
                            }
                        }, function (err) {
                            reject(err);
                        });
                    }, (GlobalVariable.apiCounter++) * parseInt(delay.toString()));

                }
            }
        });
    });
}
