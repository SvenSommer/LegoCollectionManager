import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            user_id,
            name,
            phone,
            type,
            offerscount,
            friendliness,
            satisfaction,
            accountcreated
        } = req.body;

        if (id &&
            user_id &&
            name &&
            phone && 
            type &&
            offerscount &&
            friendliness &&
            satisfaction &&
            accountcreated) {
                const updateOne = `UPDATE Offers_Users SET user_id = ${user_id},
                name = '${name}',
                phone = '${phone}',
                type = '${type}',
                offerscount = ${offerscount},
                friendliness = '${friendliness}',
                satisfaction = '${satisfaction}',
                accountcreated = '${accountcreated}'
                WHERE id=${id}`;
                connection.query(updateOne, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the users',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Users updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, user_id, name, phone,  type, offerscount, friendliness, satisfaction and accountcreated are required!'
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