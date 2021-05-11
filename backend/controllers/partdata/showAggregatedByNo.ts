import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const { searchwords } = req.params;
    let showAll = `SELECT * FROM LegoSorterDB.partdata_parts_perPartno`
    if(searchwords && !searchwords.includes('none')){
        var names = "'%" + searchwords.split( "," ).join( "%') AND NAME LIKE ('%" ) + "%'";
        var numbers = "'%" + searchwords.split( "," ).join( "%') OR NO LIKE ('%" ) + "%'";
        showAll = `SELECT * FROM LegoSorterDB.partdata_parts_perPartno
        WHERE NAME LIKE (${names}) OR NO LIKE (${numbers})`
    }
    connection.query(showAll, (err, result) => {
    if (err) {
        console.log(showAll)
        res.json({
            code: 500,
            message: 'Some error occurred while fetching agggrefated PartData for names '+ names,
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