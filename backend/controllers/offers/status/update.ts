import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            offer_id,
            status
        } = req.body;

        if (id &&
            offer_id &&
            status) {
                const updateOfferView = `UPDATE Offers_Status SET offer_id = ${offer_id},
                                        viewcount = '${status}' 
                                        WHERE id=${id}`;
                connection.query(updateOfferView, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the offer status',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Offer status updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, offer_id and status are required!'
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