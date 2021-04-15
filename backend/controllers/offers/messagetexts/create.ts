import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            message,
            active
        } = req.body;

        if (message &&
            active) {
                const createOne = `INSERT INTO Offers_MessageTexts(message,
                    active)
                VALUES(
                        '${message}',
                        ${active})`;
                connection.query(createOne, (err1, result1) => {
                    if (err1) res.json({
                        code: 500,
                        message: 'Couldn\'t create the MessageText',
                        errorMessage: process.env.DEBUG && err1
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'MessageText added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: message and active are required!'
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