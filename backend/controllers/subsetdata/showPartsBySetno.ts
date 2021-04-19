import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {setnumber: setnumber} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.expected_parts_perSetId
    WHERE setno = '${setnumber}' 
    AND type != 'MINIFIG'`
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