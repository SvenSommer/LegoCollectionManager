import { Response } from 'express';
import connection from "../../../database_connection";
import { InsertProgressDetail } from '../../progressdetails/helpers/createprogressdetails';
import { GetAndUpsertSubSetData } from '../../subsetdata/helpers/getAndUpsertSubSetData';
import { GetAndInsertSetData } from './getAndInsertSetData';
import { GetAndUpdateSetData } from './getAndUpdateSetData';

export function GetAndUpsertSetDataByNo(setnumber: any, userid: number, request_id: any): Promise<any> {

    return new Promise(function (resolve, reject) {

        const findSetDataInDB = `SELECT * FROM Setdata WHERE no='${setnumber}'`;

        connection.query(findSetDataInDB, (err, setresult: any) => {
            if (err)
                reject({
                    code: 500,
                    message: 'Some Error Occurred!',
                    //@ts-ignore
                    errorMessage: process.env.DEBUG && err
                });
            else {
                if (setresult !== 'undefined' && setresult.length > 0) {
                    const { id: setid } = setresult[0];
                    console.log(`Set already in Set Table with id ${setid}`)
                    GetAndUpdateSetData(setnumber, userid, setid).then(function () {
                        InsertProgressDetail(request_id, 10, "Set Data already existed");
                        GetAndUpsertSubSetData(setnumber, userid, request_id).then(function (data) {
                            if (data) {
                                resolve(data);
                            }
                        }, function (err) {
                            reject(err);
                        });
                    }, function (err) {
                        reject(err);
                    }).catch(function () {
                        reject({
                            code: 500,
                            message: 'Couldn\'t download the SetData',
                        });
                    });
                }
                else {
                    console.log(`Set not existend in Set Table yet setnumber: ${setnumber}, userid: ${userid}`)
                    GetAndInsertSetData(setnumber, userid).then(function () {
                        console.log('GetAndUpsertSubSetData');
                        InsertProgressDetail(request_id, 10, "Set Data Downloaded");
                        GetAndUpsertSubSetData(setnumber, userid, request_id).then(function (data) {
                            if (data) {
                                resolve(data);
                            }
                        }, function (err) {
                            reject(err);
                        });
                    }, function (err) {
                        reject(err);
                    }).catch(function () {
                        reject({
                            code: 500,
                            message: 'Couldn\'t download the SetData',
                        });
                    });;
                }
            }
        });
    });
}
