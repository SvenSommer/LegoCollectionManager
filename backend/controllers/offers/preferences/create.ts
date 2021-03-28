import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            name,
            value
        } = req.body;

        if (name &&
            value) {
                const createPreference = `INSERT INTO Offers_Preferences(name,
                    value)
                VALUES(
                        '${name}',
                        '${value}')`;
                connection.query(createPreference, (err) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create the Preference',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'Preference added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: name and value are required!'
            });
        }
    } catch (e) {
        res.json({
            code: 500,
            message: 'Some error occurred',
            error: e
        });
    }
}