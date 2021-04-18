import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {userid: userid} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.offers_detail_perUserId WHERE user_id = ${userid}`
    console.log(showAll)
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching offers',
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