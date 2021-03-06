import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const deletePrefernces = `DELETE FROM Offers_Preferences WHERE id=${id};`
    connection.query(deletePrefernces, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while deleting offers preferences',
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