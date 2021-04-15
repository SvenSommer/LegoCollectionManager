import { Response } from 'express';
import { GlobalVariable } from '../../../config/GlobalVariable';
import connection from "../../../database_connection";
import { UpsertPartDataByNo } from '../../partdata/helpers/upsertPartData';
import { InsertProgressDetail } from '../../progressdetails/helpers/createprogressdetails';
import { UpdateSetMinifigCount } from './updateSetMinifigCount';
import { UpdateSetPartCount } from './updateSetPartCount';
const blApi = require("../../../config/bl.api.js");
var async = require("async");

export function GetAndUpsertSubSetData(setnumber: any, userid: any, request_id: any) {
    const delay = process.env.DELAY_TIME || 100;
    return new Promise(function (resolve, reject) {
        blApi.bricklinkClient.getItemSubset(blApi.ItemType.Set, setnumber + "-1", { break_minifigs: false })
            .then(function (subsetData: any) {
                InsertProgressDetail(request_id, 60, "Sub Set Data Downloaded");
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
                        connection.query(insertSubSetData, (err) => {
                            if (err) {
                                console.log("ERROR while inserting subsetdata: " + err)
                                console.log(insertSubSetData);
                                reject(err);
                            }
                            else {

                                // setTimeout(function () {
                                //     UpsertPartDataByNo(entry.item.no, entry.color_id, entry.item.type, userid).then(function (data) {
                                //         totalCount--;
                                //         GlobalVariable.apiCounter--;
                                //         if (incrementCount > 5 && totalCount <= (incrementCount / 2)) {
                                //             InsertProgressDetail(request_id, 70, "Part Data Downloading.");
                                //         }
                                //         if (data && totalCount == 0) {
                                //             InsertProgressDetail(request_id, 80, "Part Data Downloaded.");
                                //             console.log("Updating the set part count and minifig count");
                                //             UpdateSetPartCount(setnumber).then(function (data) {
                                //                 if (data) {
                                //                     UpdateSetMinifigCount(setnumber).then(function (data) {
                                //                         if (data) {
                                //                             resolve(data);
                                //                         }
                                //                     }, function (err) {
                                //                         reject(err);
                                //                     });
                                //                 }
                                //             }, function (err) {
                                //                 reject(err);
                                //             });
                                //         }
                                //     }, function (err) {
                                //         reject(err);
                                //     });
                                // }, (GlobalVariable.apiCounter++) * parseInt(delay.toString()));
                            }
                        });
                    });
                });

                GlobalVariable.incrementCount = 0;
                GlobalVariable.totalCount = sets.length;
                async.eachLimit(sets, 5, makeRequest, function (err: any) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        InsertProgressDetail(request_id, 80, "Part Data Downloaded.");
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
        console.log("success");
        GlobalVariable.incrementCount++;
        if (GlobalVariable.totalCount > 0 && GlobalVariable.incrementCount > (GlobalVariable.totalCount / 2)) {
            GlobalVariable.totalCount = 0;
            InsertProgressDetail(entry.request_id, 70, "Part Data Downloading.");
        }
        callback();
    });
}
