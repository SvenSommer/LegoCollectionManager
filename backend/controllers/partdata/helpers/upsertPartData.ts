import { Response } from 'express';
import connection from "../../../database_connection";
import { getAndInsertPartDataAndPriceData } from './getAndInsertPartDataAndPriceData';
import { getAndUpdatePartData } from './getAndUpdatePartData';

export function UpsertPartDataByNo(partnumber: any, colorid: any, type: any, res: Response<any, Record<string, any>>, userid: number) {
    const findPartDataInDB = `SELECT * FROM Parts WHERE no='${partnumber}' AND color_id = ${colorid} AND type = '${type}' `;
    connection.query(findPartDataInDB, (err, partresult: any) => {
        if (err)
            res.json({
                code: 500,
                message: 'Some Error Occurred!',
                errorMessage: process.env.DEBUG && err
            });
        else {

            if (partresult !== 'undefined' && partresult.length > 0) {
                const { id: partid } = partresult[0];
                //console.log(`Part already in Parts Table with id ${partid}`)
                getAndUpdatePartData(type, partnumber, colorid, userid, partid, res);
            }
            else {
                //console.log(`Part not existend in Part Table yet type: ${type} partnumber: ${partnumber} colorid:${colorid} userid: ${userid}`)
                getAndInsertPartDataAndPriceData(type, partnumber, colorid, userid, res);
            }
        }
    });
}

export function UpdatePartDataById(partid: any, res: Response<any, Record<string, any>>, userid: number) {
    const findPartDataInDB = `SELECT * FROM Parts WHERE id = ${partid}`;
    connection.query(findPartDataInDB, (err, partresult: any) => {
        if (err)
            res.json({
                code: 500,
                message: 'Some Error Occurred!',
                //@ts-ignore
                errorMessage: process.env.DEBUG && err
            });
        else {
                const { no: partnumber } = partresult[0];
                const { type: type } = partresult[0];
                const { colorid: colorid } = partresult[0];
                getAndUpdatePartData(type, partnumber, colorid, userid, partid, res);
        }
    });
}
