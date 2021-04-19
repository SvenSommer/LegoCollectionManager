import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            offer_id,
            weight_kg,
            instructions,
            minifigs,
            boxes,
            notes
        } = req.body;

        if (id &&
            offer_id &&
            weight_kg &&
            notes) {
                const updateOne = `UPDATE Offers_Properties SET offer_id = ${offer_id},
                                        weight_kg = ${weight_kg},
                                        instructions = '${instructions}',
                                        minifigs = '${minifigs}',
                                        boxes = '${boxes}',
                                        notes = '${notes}'   
                                        WHERE id=${id}`;
                connection.query(updateOne, (err) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the offer Property',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Property view updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, offer_id, weight_kg, instructions, minifigs, boxes and notes are required!'
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