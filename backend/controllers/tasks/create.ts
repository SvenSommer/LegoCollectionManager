import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
           type_id,
           origin,
           information
        } = req.body;

        if  (type_id &&
            origin &&
        information
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
                        const createOne = `INSERT INTO Tasks(type_id,
                            origin,
                            information,
                            status_id)
                            VALUES(
                            ${type_id},
                            '${origin}',
                            '${information}',
                            1)`;
                            connection.query(createOne, (err, result:any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create new Task',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 201,
                                    message: 'new Task created',
                                    task_id: result.insertId
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