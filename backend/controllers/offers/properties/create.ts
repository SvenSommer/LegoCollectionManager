import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            offer_id,
            weight_kg,
            instructions,
            minifigs,
            boxes,
            notes
        } = req.body;

        if (offer_id &&
            weight_kg &&
            instructions &&
            minifigs &&
            boxes &&
            notes) {
                const createProperties = `INSERT INTO Offers_Properties(offer_id,
                    weight_kg,
                    instructions,
                    minifigs,
                    boxes,
                    notes)
                VALUES(
                        ${offer_id},
                        ${weight_kg},
                        '${instructions}',
                        '${minifigs}',
                        '${boxes}',
                        '${notes}')`;
                connection.query(createProperties, (err) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create the Property',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'Property added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: offer_id, weight_kg, instructions, minifigs, boxes and notes are required!'
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