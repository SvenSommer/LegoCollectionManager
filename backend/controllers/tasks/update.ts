import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            origin,
            type_id,
            information,
            status_id
        } = req.body;

        if (id &&
            origin && 
            type_id &&
            information &&
            status_id) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateOne = `UPDATE Tasks SET type_id = ${type_id},
                                            origin = '${origin}',
                                            information = '${information}',
                                            status_id = ${status_id}
                                            WHERE id=${id}`;
                connection.query(updateOne, (err, result) => {
                    if (err) {
                        console.log("Couldn\'t update Task" + err)
                        res.json({
                        code: 500,
                        message: 'Couldn\'t update Task',
                        error: process.env.DEBUG && err
                      
                        });
                    }
                    else {
                        res.json({
                            code: 200,
                            message: 'Task updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 400,
                message: 'id, type_id, origin, information and status_id are required!'
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