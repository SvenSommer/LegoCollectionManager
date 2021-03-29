import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../../database_connection";
import {Token_encodeInterface} from '../../middleware/token_encode.interface';
import { GetAndUpsertSetDataByNo } from '../../setdata/helpers/upsertSetDataByNo';


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            offer_id,
            setno,
            amount,
            comments
        } = req.body;

        if (offer_id &&
            setno &&
            amount) {

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
                        const createSet = `INSERT INTO Offers_Possiblesets(offer_id,
                            setno,
                            amount,
                            comments)
                            VALUES(
                                ${offer_id},
                                '${setno}',
                                ${amount},
                                '${comments}'
                                )`;
                        connection.query(createSet, (err) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Couldn\'t create the Set',
                                errorMessage: process.env.DEBUG && err
                            });
                            else {
                                GetAndUpsertSetDataByNo(setno, res, userid);
                                res.json({
                                    code: 201,
                                    message: 'Possible Set added and Setdata downloaded!'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: offer_id, setno, amount and comments are required!'
            });
        }
    } catch (e) {
        console.log(e)
        res.json({
            code: 500,
            message: 'Some error occurred',
            error: e
        });
    }
}