import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {setid: setid} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.subsets_basis
    WHERE setid = '${setid}' 
    AND type != 'MINIFIG'
    ORDER BY CONCAT (color_name, ' ',name)`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Subsetdata for setno',
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