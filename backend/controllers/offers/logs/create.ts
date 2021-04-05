import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            componentid,
            level,
            message

        } = req.body;

        if (componentid &&
            level &&
            message) {
                const createOne = `INSERT INTO Offers_Logs(componentid,
                    level,
                    message)
                    VALUES(
                        ${componentid},
                        '${level}',
                        '${message}')`;
                connection.query(createOne, (err) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create a new Log message',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'Log message added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: componentid, level and message are required!'
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