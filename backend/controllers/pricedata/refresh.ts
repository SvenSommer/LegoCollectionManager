import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';
import { ArchiveAndUpdatePriceData } from './helpers/archiveAndUpdatePriceData';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            priceid
        } = req.body;

        if (priceid) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const findPriceDataInDB = `SELECT * FROM Pricedata WHERE id=${priceid}`;
                        connection.query(findPriceDataInDB, (err, priceresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(priceresult == 'undefined' || priceresult.length == 0) res.json({
                                        code: 202,
                                        message: 'PriceData is not downloaded yet!',
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    const { id: userid } = result[0];
                                    ArchiveAndUpdatePriceData(priceid, res, priceresult, userid);
                                    res.json({
                                        code: 201,
                                        message: 'Pricedata successfully refreshed!',
                                    });
                                }
                            }
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'priceid is required!'
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



