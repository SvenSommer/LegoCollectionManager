import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../../database_connection";
import {Token_encodeInterface} from '../../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            wordposition,
            word,
            nearwords,
            counter,
            overallcounter
        } = req.body;
        if (wordposition &&
            word &&
            nearwords &&
            counter &&
            overallcounter) {
            //@ts-ignore

            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const createOne = `INSERT INTO Partnames_Frequency(wordposition,
                    word,
                    nearwords,
                    counter,
                    overallcounter)
                    VALUES(
                    ${wordposition},
                    `+ connection.escape(word) + `,
                    `+ connection.escape(nearwords) + `,
                    ${counter},
                    ${overallcounter})`;

                connection.query(createOne, (err) => {
                    if (err) {
                        //console.log(err);
                        console.log("Err" + err.code + " WORD: "+  word + " Wordposition: " + wordposition);
                        res.json({
                            code: 500,
                            message: 'Couldn\'t create new Partnames_Frequency',
                            errorMessage: process.env.DEBUG && err
                        });
                    }else {
                        res.json({
                            code: 201,
                            message: 'new Partnames Frequency created'
                        });
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'wordposition, word, nearwords, counter and overallcounter are required! For '+ " WORD: "+  word + " Wordposition: " + wordposition
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