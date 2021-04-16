import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            message,
            active
        } = req.body;

        if (id &&
            message &&
            active) {
                const updateOne = `UPDATE Offers_MessageTexts SET message = '${message}',
                active = ${active} WHERE id=${id}`;
                connection.query(updateOne, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the MessageText',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'MessageText updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, message and active are required!'
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