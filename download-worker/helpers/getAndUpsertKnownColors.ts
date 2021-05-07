import { Response } from 'express';
import { GlobalVariable } from '../config/GlobalVariable';
import connection from "../database_connection";
import { UpsertPartDataByNo } from './upsertPartData';
import { InsertProgressDetail } from '../services/progress.details.service';
import { UpdateSetMinifigCount } from './updateSetMinifigCount';
import { UpdateSetPartCount } from './updateSetPartCount';
const blApi = require("../config/bl.api.js");
var async = require("async");


export function GetAndUpsertKnownColors(partno: any, userId: any, task_id: any, information: any) {
    const delay = process.env.DELAY_TIME || 100;
    return new Promise(function (resolve, reject) {
        blApi.bricklinkClient.getKnownColors(blApi.ItemType.Part, partno)
            .then(function (colorData: any) {
                if (!colorData || colorData.length <= 0) {
                    reject({
                        code: 500,
                        message: `Some error occurred. No ColoData for ${partno} received`,
                    });
                }
                InsertProgressDetail(task_id, 15, "ColoData Downloading", information);
                var totalCount = 0;
                var incrementCount = 1;
                var colors = new Array<any>();
                colorData.forEach(function (entry: any) {
                    totalCount++;
                    incrementCount++;
                    entry.partno = partno;
                    entry.userid = userId;
                    entry.information = information;
                    entry.task_id = task_id;
                    colors.push(entry);
                });

                GlobalVariable.incrementCount = 0;
                GlobalVariable.totalCount = colors.length;
                async.eachLimit(colors, GlobalVariable.subSetDownloadLimit, makeRequest, function (err: any) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        InsertProgressDetail(task_id, 96, "Color Data Downloaded.", information);
                        resolve(true);
                    }
                });

            });
    });
}


export function makeRequest(entry: any, callback: any) {
    UpsertPartDataByNo(entry.partno, entry.color_id, "PART", entry.userid).then(function (data) {
        GlobalVariable.incrementCount++;
        if (GlobalVariable.totalCount > 0) {
            let percentage = GlobalVariable.incrementCount / ((GlobalVariable.totalCount + 2) / 2) * 100;
            //console.log(`success, downloaded: ${percentage}%`);

            InsertProgressDetail( entry.task_id, percentage * 0.8 + 15, "Part Data Downloading.", entry.information);
        }
        if (GlobalVariable.totalCount > 0 && GlobalVariable.incrementCount > (GlobalVariable.totalCount / 2)) {
            GlobalVariable.totalCount = 0;

        }
        callback();
    });
}
