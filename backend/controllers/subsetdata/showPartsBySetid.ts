import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {setid: setid} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.subset_parts_perSetId
    WHERE setid = '${setid}' 
    AND type != 'MINIFIG'`
    connection.query(showAll, (err, parts) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Subsetdata for setno',
            errorMessage: process.env.DEBUG && err
        });
        else {
            const showSum = `SELECT * FROM LegoSorterDB.subset_parts_sumParts_perSetId
            WHERE setid = '${setid}'`
            connection.query(showSum, (err, sum_parts) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some error occurred while fetching Subsetdata for setno',
                    errorMessage: process.env.DEBUG && err
                });
                else {
                    res.json({
                        code: 200,
                        sum_parts,
                        parts
                    });
                }
            })
        }
    })
}