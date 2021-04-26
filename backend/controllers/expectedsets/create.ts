import { Request, Response } from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import { Token_encodeInterface } from '../middleware/token_encode.interface';


export default (req: Request, res: Response) => {
    try {
        const { token } = req.cookies;
        const {
            collectionid,
            setno,
            comments,
            instructions,
            condition,
            status = 10
        } = req.body;

        if (collectionid &&
            setno) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const { username } = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, userResult: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const { id: userid } = userResult[0];
                        const createOne = `INSERT INTO Expectedsets (
                                                  collection_id,
                                                  setNo,
                                                  comments,
                                                  instructions,
                                                  Expectedsets.condition,
                                                  status,
                                                  created,
                                                  createdBy)
                                                  VALUES(
                                                          ${collectionid},
                                                         '${setno}',
                                                         '${comments}',
                                                         '${instructions}',
                                                         '${condition}',
                                                          ${status},
                                                          NOW(),
                                                          ${userid})`;
                        connection.query(createOne, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create the Expected set',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                res.json({
                                    code: 201,
                                    message: `Set ${setno} to collectionid ${collectionid} added!`,
                                });


                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'collectionid and setno are required!'
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