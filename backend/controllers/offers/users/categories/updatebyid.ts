import {Request, Response} from 'express';
import connection from "../../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            category_id
        } = req.body;

        if (id &&
            category_id ) {
                const updateUser = `UPDATE LegoSorterDB.Offers_Users SET category_id = ${category_id}
                WHERE id=${id}`;
                connection.query(updateUser, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the user category',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'User category updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, category_id are required!'
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