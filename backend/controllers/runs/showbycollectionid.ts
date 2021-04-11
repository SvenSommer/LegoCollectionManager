import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const sumQuery = `SELECT * FROM LegoSorterDB.run_detail WHERE collection_id = ${collectionid}`
    connection.query(sumQuery, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Runs summary',
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