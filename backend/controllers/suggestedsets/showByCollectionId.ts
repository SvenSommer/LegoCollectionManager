import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid} = req.params;
    const showSuggestedSetsByCollectionId = `SELECT * FROM LegoSorterDB.suggested_sets_perCollectionId WHERE collection_id = ${collectionid}`
    connection.query(showSuggestedSetsByCollectionId, (err, setsResult) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching suggested Sets',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json({
            code: 200,
            setsResult : setsResult
        });

        }
    })
}
//
