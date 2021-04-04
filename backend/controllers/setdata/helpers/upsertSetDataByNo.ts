import { Response } from 'express';
import connection from "../../../database_connection";
import { GetAndUpsertSubSetData } from '../../subsetdata/helpers/getAndUpsertSubSetData';
import { GetAndInsertSetData } from './getAndInsertSetData';
import { GetAndUpdateSetData } from './getAndUpdateSetData';

export function GetAndUpsertSetDataByNo(setnumber: any, res: Response<any, Record<string, any>>, userid: number) {
    const findSetDataInDB = `SELECT * FROM Setdata WHERE no='${setnumber}'`;

    connection.query(findSetDataInDB, (err, setresult: any) => {
        if (err)
            res.json({
                code: 500,
                message: 'Some Error Occurred!',
                //@ts-ignore
                errorMessage: process.env.DEBUG && err
            });
        else {
            if (setresult !== 'undefined' && setresult.length > 0){
                const { id: setid } = setresult[0];
                console.log(`Set already in Set Table with id ${setid}`)
                GetAndUpdateSetData(setnumber, userid, setid, res);
            } 
            else {
                console.log(`Set not existend in Set Table yet setnumber: ${setnumber}, userid: ${userid}`)
                GetAndInsertSetData(setnumber, userid, res);
            }
            GetAndUpsertSubSetData(setnumber, userid, res);
        }
    });
}
