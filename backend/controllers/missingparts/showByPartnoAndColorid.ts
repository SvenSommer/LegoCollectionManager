import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {partno: partno, colorid:colorid} = req.params;
    const showmissingparts = `SELECT * FROM LegoSorterDB.missing_parts_perSet where partno = '${partno}' AND color_id = ${colorid}`
    connection.query(showmissingparts, (err, result) => {
        if (err) {
            console.log("sql:",showmissingparts)
            console.log("error:",err)

             res.json({
                code: 500,
                message: 'Some error occurred while fetching missing parts by partno and colorid',
                errorMessage: process.env.DEBUG && err
            });
        }
        else {
            res.json({
                code: 200,
                result
            });  
        }
    })
}