import { Response } from 'express';
import connection from "../../../database_connection";
import { UpsertPriceData } from '../../pricedata/helpers/upsertPriceData';
const blApi = require("../../../config/bl.api.js");

export function getAndUpdatePartAndPriceData(type: any, partnumber: any, colorid: any, userid: any, partid: any, res: Response<any, Record<string, any>>) {
    blApi.bricklinkClient.getCatalogItem(type, partnumber, colorid)
        .then(function (partinfo: any) {
            blApi.bricklinkClient.getPriceGuide(type, partnumber,
                {
                    new_or_used: blApi.Condition.Used,
                    color_id: colorid,
                    region: 'europe',
                    guide_type: 'stock'
                }).then(function (priceinfostockdata: any) {
                    blApi.bricklinkClient.getPriceGuide(type, partnumber,
                        {
                            new_or_used: blApi.Condition.Used,
                            color_id: colorid,
                            region: 'europe',
                            guide_type: 'sold'
                        }).then(function (priceinfosolddata: any) {
                            const updatePartData = `UPDATE Parts SET 
                                                    name = '${partinfo.name.replace("'","`").replace("'","`")}',
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
                            connection.query(updatePartData, (err) => {
                                if (err){
                                    console.log("ERROR while Inserting Parts" + err)
                                    console.log(updatePartData)
                                }

                                    UpsertPriceData(partnumber, colorid, type, 'U', 'europe', 'stock', res, userid);
                                    UpsertPriceData(partnumber, colorid, type, 'U', 'europe', 'sold', res, userid);
                            });
                        });
                });
        });
}
