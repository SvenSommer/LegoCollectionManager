import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    const {offerid: offer_id} = req.params;
    const showAllCollections = `SELECT *
                                FROM LegoSorterDB.offer_images_perOfferId  WHERE offer_id = ${offer_id};`
    connection.query(showAllCollections, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching offers images',
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