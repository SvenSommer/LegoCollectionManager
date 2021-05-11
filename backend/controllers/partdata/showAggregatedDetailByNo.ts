import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    let showAll = `SELECT * FROM LegoSorterDB.partdata_parts_perPartnoDetail order by usecount desc`
    console.log(showAll)
    connection.query(showAll, (err, result) => {
    if (err) {
        console.log(showAll)
        res.json({
            code: 500,
            message: 'Some error occurred while fetching agggrefated PartDataDetail',
            errorMessage: process.env.DEBUG && err
        });
     } else {
            res.json({
                code: 200,
                result
            });
        }
    })
}