import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            word,
            active
        } = req.body;

        if (word &&
            active) {
                const createOne = `INSERT INTO Offers_Blacklist(word,
                    active)
                VALUES(
                        '${word}',
                        ${active})`;
                connection.query(createOne, (err, result:any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create the Blacklist word',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: `Blacklist word with id ${result.insertId} created!`,
                            searchterm_id: result.insertId
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: word and active are required!'
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