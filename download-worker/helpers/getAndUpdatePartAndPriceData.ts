import { Response } from 'express';
import { GlobalVariable } from '../config/GlobalVariable';
import connection from "../database_connection";
import { UpsertPriceData } from './upsertPriceData';
const blApi = require("../config/bl.api.js");

export async function getAndUpdatePartAndPriceData(type: any, partnumber: any, colorid: any, userid: any, partid: any): Promise<any> {
    const delay = process.env.DELAY_TIME || 100;
    return await new Promise(async function (resolve, reject) {
        try {
            setTimeout(() => {
                blApi.bricklinkClient.getCatalogItem(type, partnumber, colorid)
                    .then(function (partinfo: any) {
                        if (!partinfo || !partinfo.name) {
                            reject({
                                code: 500,
                                message: 'Some error occurred',
                            });
                        }
                        GlobalVariable.apiCounter--;
                        setTimeout(() => {
                            blApi.bricklinkClient.getPriceGuide(type, partnumber,
                                {
                                    new_or_used: blApi.Condition.Used,
                                    color_id: colorid,
                                    region: 'europe',
                                    guide_type: 'stock'
                                }).then(function (priceinfostockdata: any) {
                                    if (!priceinfostockdata || !priceinfostockdata.qty_avg_price) {
                                        reject({
                                            code: 500,
                                            message: 'Some error occurred',
                                        });
                                    }
                                    GlobalVariable.apiCounter--;
                                    setTimeout(async () => {
                                        await blApi.bricklinkClient.getPriceGuide(type, partnumber,
                                            {
                                                new_or_used: blApi.Condition.Used,
                                                color_id: colorid,
                                                region: 'europe',
                                                guide_type: 'sold'
                                            }).then(function (priceinfosolddata: any) {
                                                GlobalVariable.apiCounter--;
                                                const updatePartData = `UPDATE Partdata SET 
                                                            name = '${partinfo.name.replace("'", "`").replace("'", "`")}',
                                                            category_id = '${partinfo.category_id}',
                                                            year = '${partinfo.year_released}',
                                                            weight_g = '${partinfo.weight}',
                                                            size = '${partinfo.dim_x} x ${partinfo.dim_y} x ${partinfo.dim_z} cm',
                                                            is_obsolete = ${partinfo.is_obsolete ? 1 : 0},
                                                            qty_avg_price_stock = ${priceinfostockdata.qty_avg_price},
                                                            qty_avg_price_sold = ${priceinfosolddata.qty_avg_price},
                                                            image_url = '${partinfo.image_url}',
                                                            thumbnail_url = '${partinfo.thumbnail_url}',
                                                            created = NOW(),
                                                            createdBy = ${userid}
                                                            WHERE id = ${partid}
                                                            `;
                                                connection.query(updatePartData, async (err) => {
                                                    if (err) {
                                                        console.log("ERROR while Inserting Parts" + err)
                                                    }
                                                    else {
                                                        UpsertPriceData(partnumber, colorid, type, 'U', 'europe', 'stock', userid).then(function (data) {
                                                            if (data) {
                                                                UpsertPriceData(partnumber, colorid, type, 'U', 'europe', 'sold', userid).then(function (data) {
                                                                    if (data) {
                                                                        resolve(data);
                                                                    }
                                                                }, function (err) {
                                                                    reject(err);
                                                                });
                                                            }
                                                        }, function (err) {
                                                            reject(err);
                                                        });
                                                    }
                                                });
                                            });
                                    }, (GlobalVariable.apiCounter++) * parseInt(delay.toString()));
                                });
                        }, (GlobalVariable.apiCounter++) * parseInt(delay.toString()));
                    });
            }, (GlobalVariable.apiCounter++) * parseInt(delay.toString()));
        }
        catch (ex) {
            console.log("Error " + ex);
        }
    });
}
