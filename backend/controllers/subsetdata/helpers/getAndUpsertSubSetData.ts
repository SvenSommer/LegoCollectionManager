import { Response } from 'express';
import connection from "../../../database_connection";
import { UpsertPartDataByNo } from '../../partdata/helpers/upsertPartData';
import { UpdateSetMinifigCount } from './updateSetMinifigCount';
import { UpdateSetPartCount } from './updateSetPartCount';
const blApi = require("../../../config/bl.api.js");

export function GetAndUpsertSubSetData(setnumber: any, userid: any, res: Response<any, Record<string, any>>) {
    blApi.bricklinkClient.getItemSubset(blApi.ItemType.Set, setnumber + "-1", { break_minifigs: false })
        .then(function (subsetData: any) {
            subsetData.forEach(function (subsetdataEntry: any) {
                subsetdataEntry["entries"].forEach(function (entry: any) {
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
                                                    '${entry.item.name.replace("'","`").replace("'","`")}',
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
                            console.log(insertSubSetData)
                        }
                    });
                    
                   UpsertPartDataByNo(entry.item.no, entry.color_id, entry.item.type, res, userid);
                   
                });
            });
        });
        //TODO: wait for download to complete
        UpdateSetPartCount(setnumber);
        UpdateSetMinifigCount(setnumber);
}
