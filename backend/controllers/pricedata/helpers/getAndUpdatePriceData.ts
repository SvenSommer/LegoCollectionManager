/* import { Response } from 'express';
import connection from "../../../database_connection";
const blApi = require("../../../config/bl.api.js");

export function GetAndUpdatePriceData(type: any, partnumber: any, con: any, colorid: any, region: any, guide_type: any, userid: any, priceid: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        blApi.bricklinkClient.getPriceGuide(type, partnumber,
            {
                new_or_used: con,
                color_id: colorid,
                region: region,
                guide_type: guide_type
            }).then(function (priceinfo: any) {
                const updatePriceData = `UPDATE Pricedata SET 
                                                    min_price = ${priceinfo.min_price},
                                                    max_price = ${priceinfo.max_price},
                                                    avg_price = ${priceinfo.avg_price},
                                                    qty_avg_price = ${priceinfo.qty_avg_price},
                                                    unit_quantity = ${priceinfo.unit_quantity},
                                                    total_quantity = ${priceinfo.total_quantity},
                                                    created = NOW(),
                                                    createdBy = ${userid}
                                                    WHERE id = ${priceid}
                                                    `;
                connection.query(updatePriceData, (err) => {
                    if (err) {
                        console.log(err)
                        reject({
                            code: 500,
                            message: 'Couldn\'t update PriceData',
                            errorMessage: process.env.DEBUG && err
                        });
                    }
                    else {
                        resolve(true);
                    }
                });
            });
    });
}
 */