import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    const showAllPreferences = `SELECT *
                                FROM Offers_Preferences;`
    connection.query(showAllPreferences, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching offers preferences',
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