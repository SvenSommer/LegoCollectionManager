import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {expectedsetid: expectedsetid} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.expected_parts_perSet
    WHERE expectedset_id = '${expectedsetid}' 
    AND type != 'MINIFIG'`
    connection.query(showAll, (err, expected_parts) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Subsetdata for setno',
            errorMessage: process.env.DEBUG && err
        });
        else {
            const showSum = `SELECT * FROM LegoSorterDB.expected_parts_SumPerExpectedSet
            WHERE expectedset_id = '${expectedsetid}' 
            AND type != 'MINIFIG'`
            connection.query(showSum, (err, sum_expected_parts) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some error occurred while fetching Subsetdata for setno',
                    errorMessage: process.env.DEBUG && err
                });
                else {
                    res.json({
                        code: 200,
                        sum_expected_parts,
                        expected_parts
                    });
                }
            })
        }
    })
}