import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            user_id,
            name,
            type,
            offerscount,
            friendliness,
            satisfaction,
            accountcreated
        } = req.body;

        if (user_id &&
            name &&
            type &&
            offerscount &&
            friendliness &&
            satisfaction &&
            accountcreated
            ) {
                const createImage = `INSERT INTO Offers_Users(user_id,
                    name,
                    type,
                    offerscount,
                    friendliness,
                    satisfaction,
                    accountcreated)
                VALUES(
                        ${user_id},
                        '${name}',
                        '${type}',
                        ${offerscount},
                        '${friendliness}',
                        '${satisfaction}',
                        '${accountcreated}')`;
                connection.query(createImage, (err1) => {
                    if (err1) res.json({
                        code: 500,
                        message: 'Couldn\'t create the User information',
                        errorMessage: process.env.DEBUG && err1
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'User information added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: user_id, name, type, offerscount, friendliness, satisfaction and accountcreated are required!'
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