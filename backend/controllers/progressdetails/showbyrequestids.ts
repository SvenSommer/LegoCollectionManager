import { Request, Response } from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import { Token_encodeInterface } from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const { token } = req.cookies;
        const { id } = req.params;

        if (id) {
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
                        var ids = "'" + id.split( "," ).join( "','" ) + "'";
                        const showAll = `select * from ProgressDetail where id in(select max(id) from ProgressDetail where request_id in (${ids})  group by request_id);`
                        connection.query(showAll, (err, result) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some error occurred while fetching Users',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 200,
                                    result
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'request Ids field is required!'
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





