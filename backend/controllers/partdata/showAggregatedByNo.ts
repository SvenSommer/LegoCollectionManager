import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const { searchwords } = req.params;
    console.log("searchwords",searchwords)
    let showAll = `SELECT json_arrayagg(color_id) as colors, no, name FROM LegoSorterDB.Partdata
    GROUP BY no, name`
    if(searchwords && !searchwords.includes('none')){
        var names = "'%" + searchwords.split( "," ).join( "%') AND NAME LIKE ('%" ) + "%'";
        showAll = `SELECT json_arrayagg(color_id) as colors, no, name FROM LegoSorterDB.Partdata
        WHERE NAME LIKE (${names})
        GROUP BY no, name`
    }
    console.log(showAll)
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