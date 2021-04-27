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
        if (offer_id) {
            const findById = `SELECT *
            FROM Offers_Properties WHERE offer_id = ${offer_id};`
            connection.query(findById, (err, result:any) => {
                if(result.length > 0){
                    const id = result[0].id;
                    const updateOne = `UPDATE Offers_Properties SET offer_id = ${offer_id},
                    weight_kg = ${weight_kg},
                    instructions = '${instructions}',
                    minifigs = '${minifigs}',
                    boxes = '${boxes}',
                    notes = '${notes}'   
                    WHERE id=${id}`;
                    connection.query(updateOne, (err) => {
                    if (err) { console.log(updateOne)
                        res.json({
                            code: 500,
                            message: 'Couldn\'t updated the offer Property',
                            error: process.env.DEBUG && err
                        });
                    } else {
                            res.json({
                                code: 200,
                                message: 'Offer Property updated!'
                            });
                        }
                    });
                } else {
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
                            if (err) { 
                                console.log(createProperties)
                                res.json({
                                code: 500,
                                message: 'Couldn\'t create the Property',
                                errorMessage: process.env.DEBUG && err
                            });
                        } else {
                                res.json({
                                    code: 201,
                                    message: 'Property added!'
                                });
                            }
                        })
                    }

                });
            } else {
                res.json({
                    code: 400,
                    message: 'Missing Parameter: offer_id is required!'
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