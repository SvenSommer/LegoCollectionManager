import { Request, Response } from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import { GlobalVariable } from '../../../config/GlobalVariable';
import connection from "../../../database_connection";
import { Token_encodeInterface } from '../../middleware/token_encode.interface';
import { InsertProgressDetail } from '../../progressdetails/helpers/createprogressdetails';
import { GetAndUpsertSetDataByNo } from '../../setdata/helpers/upsertSetDataByNo';

export default (req: Request, res: Response) => {
    try {
        const { token } = req.cookies;
        const {
            offer_id,
            setno,
            amount,
            comments,
            request_id
        } = req.body;

        if (offer_id &&
            setno &&
            amount && request_id) {

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
                                try {
                                    console.log("Start on: " + new Date());
                                    InsertProgressDetail(request_id, 2, "Download Started");
                                    GetAndUpsertSetDataByNo(setno, userid, request_id).then(function (data) {
                                        if (data) {
                                            InsertProgressDetail(request_id, 100, "All Data Downloaded.");
                                            console.log("End on: " + new Date());
                                            GlobalVariable.apiCounter = 0;
                                            res.json({
                                                code: 201,
                                                message: 'Possible Set added and Setdata downloaded!'
                                            });
                                        }
                                    }, function (err) {
                                        GlobalVariable.apiCounter = 0;
                                        res.json({
                                            code: 500,
                                            message: 'Couldn\'t create the Set',
                                            errorMessage: process.env.DEBUG && err
                                        });
                                    });
                                }
                                catch (ex) {
                                    console.log("error");
                                }
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: offer_id, setno, amount, request_id and comments are required!'
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