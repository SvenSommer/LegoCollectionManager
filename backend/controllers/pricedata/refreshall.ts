import { Console } from 'console';
import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';
import { ArchiveAndUpdatePriceData } from './helpers/archiveAndUpdatePriceData';

const blApi = require("../../config/bl.api.js");

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            batchsize
         } = req.body;
 
         if (batchsize) {
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
                        const findallPrices = `SELECT * FROM Prices WHERE created < CURDATE() LIMIT ${batchsize}`;
                        
                        connection.query(findallPrices, (err, allpricesresult: any) => {
                            if (err) res.json({
                                code: 500,
                                message: 'Some Error Occurred!',
                                //@ts-ignore
                                errorMessage: process.env.DEBUG && err
                            });
                            else{
                                if(allpricesresult == 'undefined' || allpricesresult.length == 0) res.json({
                                        code: 202,
                                        message: 'no existing PriceData found that is not up to date!',
                                        //@ts-ignore
                                        errorMessage: process.env.DEBUG && err
                                    });
                                else{
                                    allpricesresult.forEach(function(priceresult:any){
                                        if(priceresult != 'undefined' || priceresult.length > 0) {
                                            //console.log(priceresult)
                                            const {id: priceid} = priceresult;
                                            const {id: userid } = userResult[0];
                                            ArchiveAndUpdatePriceData(priceid, res, priceresult, userid);
                                        }
                                        else
                                        console.log("priceresuilt was null")
                                    });
                                    res.json({
                                        code: 201,
                                        message: 'PriceData successfully downloaded and refreshed!'
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
                message: 'Batchsize is required!'
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