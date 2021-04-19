import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const showSingle = `SELECT IFNULL(max(no)+1,1) as next_runno FROM LegoSorterDB.Runs WHERE collection_id = ${collectionid};`
    connection.query(showSingle, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching next next Run no',
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