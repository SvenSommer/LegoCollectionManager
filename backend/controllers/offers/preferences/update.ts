import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
           name,
           value
        } = req.body;

        if (id &&
            name &&
            value) {
                const updateOfferPreferences = `UPDATE Offers_Preferences SET name = '${name}',
                                        value = '${value}'    
                                        WHERE id=${id}`;
                connection.query(updateOfferPreferences, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the offer preferences',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Offer preferences updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, name and value are required!'
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