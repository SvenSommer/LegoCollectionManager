import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const deleteSearchterm = `DELETE FROM Offers_Searchterms WHERE id=${id};`
    connection.query(deleteSearchterm, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while deleting offers searchterm',
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