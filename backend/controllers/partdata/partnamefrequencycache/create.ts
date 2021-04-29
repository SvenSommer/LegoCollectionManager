import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../../database_connection";
import {Token_encodeInterface} from '../../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            searchwords,
            activeButtonsWords,
            activeButtonsNumbers} = req.body;
        if (searchwords) {
            //@ts-ignore

            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const createOne = `INSERT INTO PartnameFrequency_Cache(searchwords,
                    activeButtonsWords,
                    activeButtonsNumbers)
                    VALUES(
                    `+ connection.escape(searchwords) + `,
                    `+ connection.escape(activeButtonsWords) + `,
                    `+ connection.escape(activeButtonsNumbers) + `)`;

                connection.query(createOne, (err) => {
                    if (err) {
                        //console.log(err);
                        console.log("Err" + err.code + " searchwords: "+  searchwords + " activeButtonsWords: " + activeButtonsWords);
                        res.json({
                            code: 500,
                            message: 'Couldn\'t create new PartnameFrequency_Cache',
                            errorMessage: process.env.DEBUG && err
                        });
                    }else {
                        res.json({
                            code: 201,
                            message: 'new Cache Entry created'
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'searchwords is required!'
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