import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            word,
            active
        } = req.body;

        if (id &&
            word &&
            active ) {
                const updateOne = `UPDATE Offers_Blacklist SET word = '${word}',
                                        active = ${active}
                                        WHERE id=${id}`;
                connection.query(updateOne, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the blacklisted word',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Blacklisted word updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, word and active are required!'
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