import { Response } from 'express';
import connection from "../database_connection";
import { PriceInfo } from "../models/model";
import { UpsertPriceData } from './upsertPriceData';
const blApi = require("../config/bl.api.js");

export function getAndInsertPartAndPriceData(type: any, partnumber: any, colorid: any, userid: any): Promise<any> {
    const delay = process.env.DELAY_TIME || 100;
    return new Promise(function (resolve, reject) {
        blApi.bricklinkClient.getCatalogItem(type, partnumber, colorid)
            .then(function (partinfo: any) {
                if(process.env.DEBUG == "True") console.log(type + ' getAndInsertPartAndPriceData ' + partnumber);
                setTimeout(() => {
                    blApi.bricklinkClient.getPriceGuide(type, partnumber,
                        {
                            new_or_used: blApi.Condition.Used,
                            color_id: colorid,
                            region: 'europe',
                            guide_type: 'stock'
                        }).then(function (priceinfoStock: PriceInfo) {
                            if(process.env.DEBUG == "True") console.log('getPriceGuide stock' + new Date());
                            setTimeout(() => {
                                blApi.bricklinkClient.getPriceGuide(type, partnumber,
                                    {
                                        new_or_used: blApi.Condition.Used,
                                        color_id: colorid,
                                        region: 'europe',
                                        guide_type: 'sold'
                                    }).then(function (priceinfoSold: PriceInfo) {
                                        if(process.env.DEBUG == "True") console.log('getPriceGuide sold ' + new Date());
                                        const createPartData = `INSERT INTO Partdata (
                                            no,
                                            name,
                                            type,
                                            category_id,
                                            color_id,
                                            year,
                                            weight_g,
                                            size,
                                            is_obsolete,
                                            qty_avg_price_stock,
                                            qty_avg_price_sold,
                                            image_url,
                                            thumbnail_url,
                                            createdBy)
                                            VALUES(
                                            '${partinfo.no}',
                                            `+ connection.escape(partinfo.name) + `,
                                            '${type}',
                                             ${partinfo.category_id},
                                             ${colorid},
                                            '${partinfo.year_released}',
                                             ${partinfo.weight},
                                            '${partinfo.dim_x} x ${partinfo.dim_y} x ${partinfo.dim_z} cm',
                                             ${partinfo.is_obsolete},
                                             ${priceinfoStock.qty_avg_price},
                                             ${priceinfoSold.qty_avg_price},
                                            '${partinfo.image_url}',
                                            '${partinfo.thumbnail_url}',
                                             ${userid}
                                            )`;
                                        connection.query(createPartData, (err: any) => {
                                            if (err) {
                                                reject({
                                                    code: 500,
                                                    message: 'Couldn\'t store downloaded PartData',
                                                    errorMessage: process.env.DEBUG && err
                                                });
                                                console.log(err)
                                                console.log(createPartData)
                                            }
                                            else {
                                                const region = 'europe';
                                               // console.log("Upsert Price Data for part" + partnumber);

                                                setTimeout(() => {
                                                    UpsertPriceData(partnumber, colorid, type, 'U', region, 'stock', userid).then(function (data) {
                                                        if (data) {
                                                            setTimeout(() => {
                                                                UpsertPriceData(partnumber, colorid, type, 'U', region, 'sold', userid).then(function (data) {
                                                                    if (data) {
                                                                        resolve(data);
                                                                    }
                                                                }, function (err) {
                                                                    reject(err);
                                                                });
                                                            }, parseInt(delay.toString()));
                                                        }
                                                    }, function (err) {
                                                        reject(err);
                                                    });
                                                }, parseInt(delay.toString()));


                                            }
                                        });
                                    });
                            }, parseInt(delay.toString()));
                        });
                });
            }, parseInt(delay.toString()));


    });
}
