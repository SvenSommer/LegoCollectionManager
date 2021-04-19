import { Response } from 'express';
import { InsertSetData } from './insertSetData';
const blApi = require("../../../config/bl.api.js");

export function GetAndInsertSetData(setnumber: any, userid: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        blApi.bricklinkClient.getCatalogItem(blApi.ItemType.Set, setnumber + '-1')
            .then(function (setinfo: any) {
                blApi.bricklinkClient.getPriceGuide(blApi.ItemType.Set, setnumber + '-1', { new_or_used: blApi.Condition.Used, region: 'europe', guide_type: 'stock' })
                    .then(function (priceinfo: any) {
                        InsertSetData(setnumber, setinfo, priceinfo, userid).then(function (data) {
                            if (data) {
                                resolve(data);
                            }
                        }, function (err) {
                            reject(err);
                        });;
                    });
            });
    });
}
