import { Console } from 'console';
import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';
import { GetAndUpsertSetDataByNo } from '../setdata/helpers/upsertSetDataByNo';


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            collectionid,
            setnumber,
            comments,
            instructions,
            condition,
            status = 10
        } = req.body;

        if (collectionid && 
            setnumber ) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, userResult: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const {id: userid} = userResult[0];
                        const createRecognisedSet = `INSERT INTO Recognisedsets (
                                                  collection_id,
                                                  setNo,
                                                  comments,
                                                  instructions,
                                                  Recognisedsets.condition,
                                                  status,
                                                  created,
                                                  createdBy)
                                                  VALUES(
                                                          ${collectionid},
                                                         '${setnumber}',
                                                         '${comments}',
                                                         '${instructions}',
                                                         '${condition}',
                                                          ${status},
                                                          NOW(),
                                                          ${userid})`;
                        connection.query(createRecognisedSet, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create the recognised set',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                GetAndUpsertSetDataByNo(setnumber, res, userid);
                                res.json({
                                    code: 201,
                                    message: 'Recognised set created!'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'Setnumber, Instructions and collectionid are required!'
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