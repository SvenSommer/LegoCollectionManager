import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';
import { UpsertSubsetData } from './helpers/upsertSubsetData';



export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            setnumber
        } = req.body;

        if (setnumber) {
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
                        const {id: userid} = result[0];
                        UpsertSubsetData(setnumber, res, userid);
                        res.json({
                            code: 201,
                            message: 'Subsetdata successfully downloaded!',
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'setnumber is required!'
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



