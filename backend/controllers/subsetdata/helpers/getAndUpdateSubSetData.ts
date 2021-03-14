import { Response } from 'express';
import connection from "../../../database_connection";
import { UpsertPartDataByNo } from '../../partdata/helpers/upsertPartData';
const blApi = require("../../../config/bl.api.js");

export function GetAndUpdateSubSetData(setno: any, partno: any,colorid:any, type:any, userid: any, subsetid: any, res: Response<any, Record<string, any>>) {
    blApi.bricklinkClient.getCatalogItem(blApi.ItemType.Set, setno + '-1')
        .then(function (setinfo: any) {
            blApi.bricklinkClient.getPriceGuide(blApi.ItemType.Set, setno + '-1', { new_or_used: blApi.Condition.Used, region: 'europe', guide_type: 'stock' })
                .then(function (priceinfo: any) {
                    const updateSetData = `UPDATE Subsets SET 
                                            name = '${setinfo.name}',
                                            category_id = '${setinfo.category_id}',
                                            year = '${setinfo.year_released}',
                                            weight_g = '${setinfo.weight}',
                                            size = '${setinfo.dim_x} x ${setinfo.dim_y} x ${setinfo.dim_z} cm',
                                            min_price = ${priceinfo.min_price},
                                            max_price = ${priceinfo.max_price},
                                            avg_price = ${priceinfo.avg_price},
                                            qty_avg_price = ${priceinfo.qty_avg_price},
                                            unit_quantity = ${priceinfo.unit_quantity},
                                            total_quantity = ${priceinfo.total_quantity},
                                            thumbnail_url = '${setinfo.thumbnail_url}',
                                            image_url = '${setinfo.image_url}',
                                            created = NOW(),
                                            createdBy = ${userid}
                                            WHERE id = ${subsetid}
                                            `;

                    connection.query(updateSetData, (err) => {
                        if (err)
                            res.json({
                                code: 500,
                                message: 'Couldn\'t download the Subsets',
                                errorMessage: process.env.DEBUG && err
                            });
                    
                    });
                    UpsertPartDataByNo(partno, colorid, type, res, userid);
                });
        });
}
