import { Response } from 'express';
import connection from "../database_connection";
import { getAndInsertPartAndPriceData } from './getAndInsertPartAndPriceData';
import { getAndUpdatePartAndPriceData } from './getAndUpdatePartAndPriceData';

export async function UpsertPartDataByNo(partnumber: any, colorid: any, type: any, userid: number) {
    return await new Promise(function (resolve, reject) {
        const findPartDataInDB = `SELECT * FROM Partdata WHERE no='${partnumber}' AND color_id = ${colorid} AND type = '${type}' `;
        connection.query(findPartDataInDB, async (err: any, partresult: any) => {
            if (err)
                reject({
                    code: 500,
                    message: 'Some Error Occurred!',
                    errorMessage: process.env.DEBUG && err
                });
            else {
                if (partresult !== 'undefined' && partresult.length > 0) {
                    const { id: partid } = partresult[0];
                    if(process.env.DEBUG == "True") console.log(`Part already in Parts Table with id ${partid}`);
                    resolve(true)
                   /*  getAndUpdatePartAndPriceData(type, partnumber, colorid, userid, partid).then(function (data) {
                        if (data) {
                            resolve(data);
                        }
                    }, function (err) {
                        reject(err);
                    }); */
                }
                else {
                    if(process.env.DEBUG == "True") console.log(`Part not existend in Part Table yet type: ${type} partnumber: ${partnumber} colorid:${colorid} userid: ${userid}`)
                    getAndInsertPartAndPriceData(type, partnumber, colorid, userid).then(function (data) {
                        if (data) {
                            resolve(data);
                        }
                    }, function (err) {
                        reject(err);
                    });
                }
            }
        });
    });
}

export function UpdatePartDataById(partid: any, res: Response<any, Record<string, any>>, userid: number) {
    const findPartDataInDB = `SELECT * FROM Partdata WHERE id = ${partid}`;
    connection.query(findPartDataInDB, (err: any, partresult: any) => {
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
            getAndUpdatePartAndPriceData(type, partnumber, colorid, userid, partid);
        }
    });
}
