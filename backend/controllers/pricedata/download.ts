import { Request, Response } from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import { Token_encodeInterface } from '../middleware/token_encode.interface';
import { UpsertPriceData } from './helpers/upsertPriceData';

export default (req: Request, res: Response) => {
    try {
        const { token } = req.cookies;
        const {
            partnumber,
            colorid,
            type,
            condition,
            region,
            guide_type
        } = req.body;

        if (partnumber && colorid && type && condition && region && guide_type) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const { username } = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const { id: userid } = result[0];
                        UpsertPriceData(partnumber, colorid, type, condition, region, guide_type, userid).then(function (data) {
                            if (data) {
                                res.json({
                                    code: 201,
                                    message: 'Pricedata successfully downloaded!',
                                });
                            }
                        }, function (err) {
                            res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                            });
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'partnumber, colorid, type, condition, region and guide_type are required!'
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


