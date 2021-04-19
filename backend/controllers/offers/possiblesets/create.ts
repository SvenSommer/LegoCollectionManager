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
            comments
        } = req.body;

        if (offer_id &&
            setno &&
            amount) {

            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
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
                        message: `Couldn\'t add the Set ${setno} to offer_id ${offer_id}`,
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: `Set ${setno} to offer_id ${offer_id} added!`,
                        });

                        //TODO: LCM-11 Move into a seperate service triggered by a entry in the task table
                        /* try {
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
                        } */
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