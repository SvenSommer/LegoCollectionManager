/* import { Request, Response } from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import { Token_encodeInterface } from '../middleware/token_encode.interface';
import { UpsertPartDataByNo } from './helpers/upsertPartData';

export default (req: Request, res: Response) => {
    try {
        const { token } = req.cookies;
        const {
            partnumber,
            colorid,
            type
        } = req.body;

        if (partnumber && colorid && type) {
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
                        const { id: userid } = result[0]
                        UpsertPartDataByNo(partnumber, colorid, type, userid).then(function (data) {
                            if (data) {
                                res.json({
                                    code: 201,
                                    message: 'PartData successfully added or refreshed!',
                                });
                            }
                        }, function (err) {
                            res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                errorMessage: process.env.DEBUG && err
                            });
                        });

                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'partnumber,  colorid  and type are required!'
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



 */