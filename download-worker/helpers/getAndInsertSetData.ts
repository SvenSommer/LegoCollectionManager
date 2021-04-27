import { InsertSetData } from './insertSetData';
const blApi = require("../config/bl.api.js");

export function GetAndInsertSetData(setnumber: any, userid: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        blApi.bricklinkClient.getCatalogItem(blApi.ItemType.Set, setnumber + '-1')
            .then(function (setinfo: any) {
                if (setinfo.code == 404) {
                    console.log(setinfo);
                    reject(false);
                }
                blApi.bricklinkClient.getPriceGuide(blApi.ItemType.Set, setnumber + '-1', { new_or_used: blApi.Condition.Used, region: 'europe', guide_type: 'stock' })
                    .then(function (priceinfo: any) {
                        InsertSetData(setnumber, setinfo, priceinfo, userid).then(function (data) {
                            if (data) {
                                resolve(setinfo);
                            }
                        }, function (err) {
                            reject(err);
                        });;
                    });
            });
    });
}
