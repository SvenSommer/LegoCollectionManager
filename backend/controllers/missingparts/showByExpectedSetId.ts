import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {expectedsetid: expectedsetid} = req.params;
    const showmissingparts = `SELECT * FROM LegoSorterDB.missing_parts_perSet
                                            WHERE expectedset_id =  ${expectedsetid} `
    connection.query(showmissingparts, (err, missing_parts) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching missing parts by expectedset_id',
            errorMessage: process.env.DEBUG && err
        });
        else {
            const showsum_missing_parts = `SELECT * FROM LegoSorterDB.missing_parts_sumPerSet
            WHERE expectedset_id =  ${expectedsetid} `
            connection.query(showsum_missing_parts, (err, sum_missing_parts) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some error occurred while fetching missing parts by expectedset_id',
                    errorMessage: process.env.DEBUG && err
                });
                else {
                    res.json({
                        code: 200,
                        sum_missing_parts,
                        missing_parts
                    });
                }
            })
        }
    })
}