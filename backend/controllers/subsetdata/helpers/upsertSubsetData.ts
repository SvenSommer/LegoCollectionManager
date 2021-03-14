import { Response } from 'express';
import connection from "../../../database_connection";
import { GetAndInsertSubSetData } from './getAndInsertSubSetData';
import { GetAndUpdateSubSetData } from './getAndUpdateSubSetData';

export function UpsertSubsetData(setnumber: any, res: Response<any, Record<string, any>>, userid: number) {
    const findSubsetDataInDB = `SELECT * FROM Subsets WHERE no='${setnumber}'`;

    connection.query(findSubsetDataInDB, (err, subsetresults: any) => {
        if (err)
            res.json({
                code: 500,
                message: 'Some Error Occurred!',
                //@ts-ignore
                errorMessage: process.env.DEBUG && err
            });
        else {

            if (subsetresults !== 'undefined' && subsetresults.length > 0) {
                subsetresults.forEach(function (subsetresult: any) {
                    const { id: subsetid } = subsetresult;
                    const { no: partno } = subsetresult;
                    const { color_id: colorid } = subsetresult;
                    const { type: type } = subsetresult;
                    GetAndUpdateSubSetData(setnumber,partno,colorid, type, userid, subsetid, res);
                });

            }
            else {
                let subsetArray = new Array();
                GetAndInsertSubSetData(setnumber, subsetArray, userid, res);
            }
        }
    });
}
