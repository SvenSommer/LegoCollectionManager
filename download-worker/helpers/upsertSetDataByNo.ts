import { Response } from 'express';
import connection from "../database_connection";
import { InsertProgressDetail } from '../services/progress.details.service';
import { GetAndUpsertSubSetData } from './getAndUpsertSubSetData';
import { GetAndInsertSetData } from './getAndInsertSetData';
import { GetAndUpdateSetData } from './getAndUpdateSetData';

export function GetAndUpsertSetDataByNo(setnumber: any, userid: number, task_id: any, information: any): Promise<any> {

    return new Promise(function (resolve, reject) {

        const findSetDataInDB = `SELECT * FROM Setdata WHERE no='${setnumber}'`;

        connection.query(findSetDataInDB, (err: any, setresult: any) => {
            if (err)
                reject({
                    code: 500,
                    message: 'Some Error Occurred!',
                    //@ts-ignore
                    errorMessage: process.env.DEBUG && err
                });
            else {
                if (setresult !== 'undefined' && setresult.length > 0) {
                    const { id: setid, complete_part_count : partcount } = setresult[0];
                    console.log(`Set already in Set Table with id ${setid}`)
                    GetAndUpdateSetData(setnumber, userid, setid).then(function (setinfo) {
                        enrichInformationWithSetinfo(setinfo);
                        InsertProgressDetail(task_id, 10, "Set Data already existed", information);
                        if(partcount && partcount > 0) {
                            InsertProgressDetail(task_id, 96, "Set already downloaed", information);
                            resolve(true);
                        } else {
                            GetAndUpsertSubSetData(setnumber, userid, task_id, information).then(function (data) {
                                if (data) {
                                    resolve(data);
                                }
                            }, function (err) {
                                console.log(err)
                                reject(err);
                            });
                        }
                    }, function (err) {
                        console.log(err)
                        reject(err);
                    }).catch(function () {
                        console.log(err)
                        reject({
                            code: 500,
                            message: 'Couldn\'t download the SetData',
                        });
                    });
                }
                else {
                    console.log(`Set not existend in Set Table yet setnumber: ${setnumber}, userid: ${userid}`)
                    GetAndInsertSetData(setnumber, userid).then(function (setinfo) {
                        enrichInformationWithSetinfo(setinfo);
                        InsertProgressDetail(task_id, 10, "Starting Set Data Download", information);
                        GetAndUpsertSubSetData(setnumber, userid, task_id, information).then(function (data) {
                            if (data) {
                                resolve(data);
                            }
                        }, function (err) {
                            console.log(err)
                            reject(err);
                        });
                    }, function (err) {
                        console.log(err)
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

    function enrichInformationWithSetinfo(setinfo: any) {
        let infObj = JSON.parse(information);
        infObj["name"] = setinfo.name
        infObj["image_url"] = setinfo.image_url
        infObj["min_price"] = setinfo.min_price
        infObj["max_price"] = setinfo.max_price
        infObj["avg_price"] = setinfo.avg_price 
        information = JSON.stringify(infObj);
    }
}
