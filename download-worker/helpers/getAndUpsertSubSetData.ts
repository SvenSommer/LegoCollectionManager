import { Response } from 'express';
import { GlobalVariable } from '../config/GlobalVariable';
import connection from "../database_connection";
import { UpsertPartDataByNo } from './upsertPartData';
import { InsertProgressDetail } from '../services/progress.details.service';
import { UpdateSetMinifigCount } from './updateSetMinifigCount';
import { UpdateSetPartCount } from './updateSetPartCount';
const blApi = require("../config/bl.api.js");
var async = require("async");

export function GetAndUpsertSubSetData(setnumber: any, userid: any, request_id: any, information: any) {
    const delay = process.env.DELAY_TIME || 100;
    return new Promise(function (resolve, reject) {
        blApi.bricklinkClient.getItemSubset(blApi.ItemType.Set, setnumber + "-1", { break_minifigs: false })
            .then(function (subsetData: any) {
                if (!subsetData || subsetData.length <= 0) {
                    reject({
                        code: 500,
                        message: 'Some error occurred',
                    });
                }
                InsertProgressDetail(request_id, 15, "Sub Set Data Downloaded", information);
                var totalCount = 0;
                var incrementCount = 1;
                console.log(delay);
                var sets = new Array<any>();
                subsetData.forEach(function (subsetdataEntry: any) {
                    subsetdataEntry["entries"].forEach(function (entry: any) {
                        totalCount++;
                        incrementCount++;
                        entry.userid = userid;
                        entry.request_id = request_id;
                        entry.information = information;
                        sets.push(entry);
                        const insertSubSetData = `INSERT INTO Subsets (
                                                setNo,
                                                match_no,
                                                no,
                                                name,
                                                type,
                                                category_id,
                                                color_id,
                                                quantity,
                                                extra_quantity,
                                                is_alternate,
                                                is_counterpart,
                                                created,
                                                createdBy)
                                                VALUES (
                                                    ${setnumber},
                                                    ${subsetdataEntry.match_no},
                                                    '${entry.item.no}',
                                                    '${entry.item.name.replace("'", "`").replace("'", "`")}',
                                                    '${entry.item.type}',
                                                    ${entry.item.category_id},
                                                    ${entry.color_id},
                                                    ${entry.quantity},
                                                    ${entry.extra_quantity},
                                                    ${entry.is_alternate},
                                                    ${entry.is_counterpart},
                                                    NOW(),
                                                    ${userid})
                                                ON DUPLICATE KEY UPDATE id=id`;
                        connection.query(insertSubSetData, (err: string) => {
                            if (err) {
                                console.log("ERROR while inserting subsetdata: " + err)
                                console.log(insertSubSetData);
                                reject(err);
                            }
                        });
                    });
                });

                GlobalVariable.incrementCount = 0;
                GlobalVariable.totalCount = sets.length;
                async.eachLimit(sets, 3, makeRequest, function (err: any) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        InsertProgressDetail(request_id, 96, "Part Data Downloaded.", information);
                        console.log("Updating the set part count and minifig count");
                        UpdateSetPartCount(setnumber).then(function (data) {
                            if (data) {
                                UpdateSetMinifigCount(setnumber).then(function (data) {
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
    });
}


export function makeRequest(entry: any, callback: any) {
    UpsertPartDataByNo(entry.item.no, entry.color_id, entry.item.type, entry.userid).then(function (data) {
        GlobalVariable.incrementCount++;
        if (GlobalVariable.totalCount > 0) {
            let percentage = GlobalVariable.incrementCount / ((GlobalVariable.totalCount + 2) / 2) * 100;
            console.log(`success, downloaded: ${percentage}%`);
            InsertProgressDetail(entry.request_id, percentage * 0.8 + 15, "Part Data Downloading.", entry.information);
        }
        if (GlobalVariable.totalCount > 0 && GlobalVariable.incrementCount > (GlobalVariable.totalCount / 2)) {
            GlobalVariable.totalCount = 0;

        }
        callback();
    });
}
