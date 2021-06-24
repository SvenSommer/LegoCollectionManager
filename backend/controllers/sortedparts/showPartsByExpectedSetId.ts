import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {expectedsetid: expectedsetid} = req.params;
    const showsortedparts = `SELECT * FROM LegoSorterDB.sorted_parts_basis
                                            WHERE expectedset_id =  ${expectedsetid} AND type = 'PART' `
    connection.query(showsortedparts, (err, sorted_parts) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching sortedparts by expectedset_id',
            errorMessage: process.env.DEBUG && err
        });
        else {
            const showsumsortedparts = `SELECT * FROM LegoSorterDB.sorted_parts_sumParts_perSet
            WHERE expectedset_id =  ${expectedsetid}  AND type = 'PART'`
            connection.query(showsumsortedparts, (err, sum_sorted_parts) => {
            if (err) res.json({
                code: 500,
                message: 'Some error occurred while fetching sortedparts by expectedset_id',
                errorMessage: process.env.DEBUG && err
            });
            else {
                res.json({
                code: 200,
                sum_sorted_parts,
                sorted_parts
            });
            }
            })
        }
    })
}