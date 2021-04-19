import { Console } from 'console';
import { Request, Response } from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import { Token_encodeInterface } from '../middleware/token_encode.interface';
import { GetAndUpdateSetData } from './helpers/getAndUpdateSetData';


export default (req: Request, res: Response) => {
    try {
        const { token } = req.cookies;
        const {
            setid
        } = req.body;

        if (setid) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const { username } = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const { id: userid } = result[0];
                        const findDetailedSetInDB = `SELECT no FROM Setdata WHERE id='${setid}'`;
                        connection.query(findDetailedSetInDB, (err, setresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                if (setresult == 'undefined' || setresult.length == 0)
                                    res.json({
                                        code: 404,
                                        message: 'SetData with id not existend!',
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else {
                                    const { no } = setresult[0];

                                    GetAndUpdateSetData(no, userid, setid).then(function () {
                                        res.json({
                                            code: 201,
                                            message: 'SetData downloaded and refreshed!'
                                        });
                                    }, function (err) {
                                        res.json({
                                            code: 500,
                                            message: 'Couldn\'t download the SetData',
                                        });
                                    }).catch(function () {
                                        res.json({
                                            code: 500,
                                            message: 'Couldn\'t download the SetData',
                                        });
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


