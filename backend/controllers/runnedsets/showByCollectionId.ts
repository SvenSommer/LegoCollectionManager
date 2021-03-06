import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const showrunnedsetByCollectionid = `SELECT * FROM runned_set_basis
                                            WHERE collection_id =  ${collectionid} `
    connection.query(showrunnedsetByCollectionid, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching runned set by collectionid',
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