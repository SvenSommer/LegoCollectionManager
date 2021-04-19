import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            offer_id,
            status
        } = req.body;

        if (offer_id &&
            status) {
                const createStatus = `INSERT INTO Offers_Status(offer_id,
                    status)
                VALUES(
                        ${offer_id},
                        '${status}')`;
                connection.query(createStatus, (err) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create the new Status',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'Status added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: offer_id and status are required!'
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