import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {expectedsetid} = req.params;
    const showrunnedsetByCollectionid = `SELECT * FROM runned_set_basis
                                            WHERE expectedset_id =  ${expectedsetid} `
    connection.query(showrunnedsetByCollectionid, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching runned set by expectedsetid',
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