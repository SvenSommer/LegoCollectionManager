import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {statusid} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.Tasks Where status_id = ${statusid};`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Tasks',
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