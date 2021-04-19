import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const deleteOne = `DELETE FROM Expectedsets WHERE id=${id};`
    connection.query(deleteOne, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while deleting Expectedsets',
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