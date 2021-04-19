import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const showAll = `SELECT 
    * FROM sorted_set_basis`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching sortedsets',
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