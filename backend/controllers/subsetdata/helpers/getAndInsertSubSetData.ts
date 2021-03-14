import { Response } from 'express';
import connection from "../../../database_connection";
import { UpsertPartDataByNo } from '../../partdata/helpers/upsertPartData';
const blApi = require("../../../config/bl.api.js");

export function GetAndInsertSubSetData(setnumber: any, subsetArray: any[], userid: any, res: Response<any, Record<string, any>>) {
    blApi.bricklinkClient.getItemSubset(blApi.ItemType.Set, setnumber + "-1", { break_minifigs: false })
        .then(function (subsetData: any) {
            subsetData.forEach(function (subsetdataEntry: any) {
                subsetdataEntry["entries"].forEach(function (entry: any) {

                    subsetArray.push([
                        setnumber,
                        subsetdataEntry.match_no,
                        entry.item.no,
                        entry.item.name,
                        entry.item.type,
                        entry.item.category_id,
                        entry.color_id,
                        entry.quantity,
                        entry.extra_quantity,
                        entry.is_alternate,
                        entry.is_counterpart,
                        userid
                    ]);
                    //console.log(subsetArray);
                    subsetArray.forEach(element => {
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
                                                            createdBy)
                                                            VALUES (
                                                                ? )
                                                            ON DUPLICATE KEY UPDATE id=id`;
                        connection.query(insertSubSetData, [element], (err) => {
                            if (err)
                                res.json({
                                    code: 500,
                                    message: 'Couldn\'t store downloaded Subsetdata.',
                                    errorMessage: process.env.DEBUG && err
                                });
                        });
                        
                        UpsertPartDataByNo(entry.item.no, entry.color_id, entry.item.type, res, userid);
                    });
                });
            });
        });
}
