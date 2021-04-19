import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    const {offerid: offer_id} = req.params;
    const showAllByid = `SELECT *
                                FROM Offers_Status WHERE offer_id = ${offer_id};`
    connection.query(showAllByid, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching offers status',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json({
                code: 200,
                result
            });
        }
    })
}