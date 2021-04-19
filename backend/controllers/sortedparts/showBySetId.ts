import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {setid: setid} = req.params;
    const showsortedsetByCollectionid = `SELECT * FROM sortedparts_overview
                                            WHERE id =  ${setid} `
    connection.query(showsortedsetByCollectionid, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching sortedparts by collectionid',
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