import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {setnumber: setnumber} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.subsets_basis
    WHERE setno = '${setnumber}' 
    AND type = 'MINIFIG'
    ORDER BY CONCAT (color_name, ' ',name)`
    console.log(showAll)
    connection.query(showAll, (err, result) => {
        if (err) {
            console.log(showAll)
            res.json({
            code: 500,
            message: 'Some error occurred while fetching Subsetdata for setno!',
            errorMessage: process.env.DEBUG && err
        });}
        else {
            res.json({
                code: 200,
                result
            });
        }
    })
}