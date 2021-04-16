import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            offer_id,
            viewcount
        } = req.body;

        if (offer_id &&
            viewcount) {
                const createView = `INSERT INTO Offers_Views(offer_id,
                    viewcount)
                VALUES(
                        ${offer_id},
                        ${viewcount})`;
                connection.query(createView, (err) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create the View count',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'View count added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: offer_id and viewcount are required!'
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