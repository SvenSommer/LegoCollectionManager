import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';
import { UpdatePartDataById as UpsertPartDataById } from './helpers/upsertPartData';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
           partid
        } = req.body;

        if (partid) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, userquery: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const { id: userid } = userquery[0];
                        UpsertPartDataById(partid, res, userid);
                        res.json({
                            code: 201,
                            message: 'PartData successfully added or refreshed!',
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'Setnumber is required!'
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






