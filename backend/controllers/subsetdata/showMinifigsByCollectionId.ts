import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.subset_parts_perCollectionId
    WHERE collection_id = ${collectionid} AND type = 'MINIFIG' ORDER BY partno ;`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Subsetdata for collectionid',
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