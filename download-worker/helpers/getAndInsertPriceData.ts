import { InsertPriceData } from "./insertPriceData";
const blApi = require("../config/bl.api.js");
import { Response } from 'express';
import { PriceInfo } from "../models/model";

export async function GetAndInsertPriceData(condition: any, type: any, partnumber: any, colorid: any, region: any, guide_type: any, userid: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        let con = blApi.Condition.Used;
        if (condition != "U")
            con = blApi.Condition.New;

        blApi.bricklinkClient.getPriceGuide(type, partnumber,
            {
                new_or_used: con,
                color_id: colorid,
                region: region,
                guide_type: guide_type
            }).then(function (priceinfo: PriceInfo) {
                InsertPriceData(userid, { partnumber, type, priceinfo, colorid, region, guide_type }).then(function (data) {
                    resolve(data);
                }, function (err) {
                    reject(err);
                });
            });
    });
}