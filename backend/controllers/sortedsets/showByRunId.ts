import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {runid: runid} = req.params;
    const showPartsByRunId = `SELECT * FROM sorted_set_basis WHERE run_id =  ${runid} `
    connection.query(showPartsByRunId, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching sortedsets for runid',
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