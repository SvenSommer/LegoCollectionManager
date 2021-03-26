import { Response } from 'express';
import connection from "../../../database_connection";
import { PriceInfo } from "../../../models/model";
import { UpsertPriceData } from '../../pricedata/helpers/upsertPriceData';
const blApi = require("../../../config/bl.api.js");

export function getAndInsertPartAndPriceData(type: any, partnumber: any, colorid: any, userid: any, res: Response<any, Record<string, any>>) {
    blApi.bricklinkClient.getCatalogItem(type, partnumber, colorid)
        .then(function (partinfo: any) {
            blApi.bricklinkClient.getPriceGuide(type, partnumber,
                {
                    new_or_used: blApi.Condition.Used,
                    color_id: colorid,
                    region: 'europe',
                    guide_type: 'stock'
                }).then(function (priceinfoStock: PriceInfo) {
                    blApi.bricklinkClient.getPriceGuide(type, partnumber,
                        {
                            new_or_used: blApi.Condition.Used,
                            color_id: colorid,
                            region: 'europe',
                            guide_type: 'sold'
                        }).then(function (priceinfoSold: PriceInfo) {
                            const createPartData = `INSERT INTO Parts (
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
                                                    '${partinfo.name.replace("'","`").replace("'","`")}',
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
                            connection.query(createPartData, (err) => {
                                if (err) {
                                    res.json({
                                        code: 500,
                                        message: 'Couldn\'t store downloaded PartData',
                                        errorMessage: process.env.DEBUG && err
                                    });
                                    console.log(err)
                                }
                                else {
                                    const region = 'europe';
                                    UpsertPriceData(partnumber, colorid, type, 'U', region, 'stock', res, userid);
                                    UpsertPriceData(partnumber, colorid, type, 'U', region, 'sold', res, userid);
                                  
                                }
                            });
                        });
                });
        });
}
