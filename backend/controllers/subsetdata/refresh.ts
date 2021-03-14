import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';
import { GetAndUpdateSubSetData } from './helpers/getAndUpdateSubSetData';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            setid
        } = req.body;

        if (setid) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const findDetailedSetInDB = `SELECT no FROM Subsets WHERE id='${setid}'`;
                        connection.query(findDetailedSetInDB, (err, setresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(setresult == 'undefined' || setresult.length == 0) res.json({
                                        code: 202,
                                        message: `Subset with id '${setid}' not found!`,
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const {no: setno} = setresult[0];
                                    const {id: userid} = result[0];
                                    
                                    const { no: partno } = setresult[0];
                                    const { color_id: colorid } = setresult[0];
                                    const { type: type } = setresult[0];
                                    GetAndUpdateSubSetData(setno, partno,colorid, type, userid, setid, res);
                                    res.json({
                                        code: 201,
                                        message: 'Subsets downloaded and refreshed!',
                                    });
                                }
                            }
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'setid is required!'
            });
        }
    } catch (e) {
        res.json({
            code: 500,
            message: 'Some error occurred',
            error: e
        });
    }
}


