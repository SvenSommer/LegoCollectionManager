import connection from "../database_connection";
import { CheckExternalIp } from "../services/ip.service";
const blApi = require("../config/bl.api.js");

export function GetAndUpdateSetData(no: any, userid: any, setid: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        blApi.bricklinkClient.getCatalogItem(blApi.ItemType.Set, no + '-1')
            .then(function (setinfo: any) {
                if(setinfo != undefined) {
                    blApi.bricklinkClient.getPriceGuide(blApi.ItemType.Set, no + '-1', { new_or_used: blApi.Condition.Used, region: 'europe', guide_type: 'stock' })
                        .then(function (priceinfo: any) {
                            const updateSetData = `UPDATE Setdata SET 
                                                name = `+ connection.escape(setinfo.name) + `,
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
                                                WHERE id = ${setid}
                                                `;
                            if(priceinfo) {
                                setinfo["min_price"] = priceinfo.min_price;
                                setinfo["max_price"] = priceinfo.max_price;
                                setinfo["avg_price"] = priceinfo.avg_price;
                            }

                            connection.query(updateSetData, (err: any) => {
                                if (err) {
                                    console.log(updateSetData)
                                    console.log("err1",err);
                                    reject({
                                        code: 500,
                                        message: 'Couldn\'t download the SetData',
                                        errorMessage: process.env.DEBUG && err
                                    });
                                }
                                else {
                                    resolve(setinfo);
                                }
                            });
                        }); 
                } else {
                    console.log("No setinfo data available")
                    CheckExternalIp();
                }


            }).catch(function () {
                console.log("error...");
                reject({
                    code: 500,
                    message: 'Couldn\'t download the SetData',
                });
            });
            
    });
}
