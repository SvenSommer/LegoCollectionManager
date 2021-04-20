import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            task_id,
            information,
            progress,
            status
        } = req.body;

        if  (task_id &&
            information &&
            progress &&
            status
             ) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username:currentusernme} = decoded;
                const findUser = `SELECT * FROM LegoSorterDB.Users WHERE username='${currentusernme}'`;
                connection.query(findUser, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const {id} = result[0];
                        const insertOne = `INSERT INTO ProgressDetail (
                            task_id,
                            information,
                            progress,
                            status,
                            created)
                            VALUES (
                                ${task_id},
                                '${information}',
                                ${progress},
                                '${status}',
                                NOW())`;
                            connection.query(insertOne, (err,) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create new Progress',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 201,
                                    message: 'new Progress created'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'type, information and status are required!'
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