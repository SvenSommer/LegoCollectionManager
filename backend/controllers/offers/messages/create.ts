import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            account_id,
            offer_id,
            messagetext_id
        } = req.body;

        if (account_id &&
            offer_id &&
            messagetext_id) {
                const createOne = `INSERT INTO Offers_Messages(account_id,
                    offer_id,
                    messagetext_id)
                VALUES(
                        ${account_id},
                        ${offer_id},
                        ${messagetext_id})`;
                connection.query(createOne, (err1, result1) => {
                    if (err1) {
                        console.log(createOne)
                        res.json({
                        code: 500,
                        message: 'Couldn\'t create a new Message',
                        errorMessage: process.env.DEBUG && err1
                    });
                 } else {
                        res.json({
                            code: 201,
                            message: 'Message added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: account_id, offer_id and messagetext_id are required!'
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