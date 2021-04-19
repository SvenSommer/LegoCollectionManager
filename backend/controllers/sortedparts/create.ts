import { Console } from 'console';
import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            identifiedpart_id,
            sortedset_id,
            detected
        } = req.body;

        if (identifiedpart_id && 
            sortedset_id && 
            detected) {
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
                        const {id:userid} = result[0];
                        const createSortedParts = `INSERT INTO SortedParts (
                                                    identifiedpart_id,
                                                    sortedset_id,
                                                    detected,
                                                  createdBy)
                                                  VALUES(
                                                          ${identifiedpart_id},
                                                          ${sortedset_id},
                                                          ${detected},
                                                          ${userid})`;
                        connection.query(createSortedParts, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create new SortedPart',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 201,
                                    message: 'new SortedPart created!'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'identifiedpart_id, sortedset_id and detected are required!'
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