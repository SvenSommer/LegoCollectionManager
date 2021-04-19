import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const deleteCollection = `DELETE FROM Offers_Users WHERE id=${id};`
    connection.query(deleteCollection, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while deleting users from offers',
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