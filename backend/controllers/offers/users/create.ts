import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        let {
            user_id,
            name,
            phone,
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
                if (!phone)
                phone = 'unknown';
                const findById = `SELECT *
                FROM Offers_Users WHERE user_id = ${user_id};`
                connection.query(findById, (err, result:any) => {
                    if(result.length > 0){
                        const user_id = result[0].id;
                        const updateOne = `UPDATE Offers_Users SET
                        name = '${name}',
                        phone = '${phone}',
                        type = '${type}',
                        offerscount = ${offerscount},
                        friendliness = '${friendliness}',
                        satisfaction = '${satisfaction}',
                        accountcreated = '${accountcreated}'
                                                WHERE user_id=${user_id}`;
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
                        });
                    } else {
                        const createImage = `INSERT INTO Offers_Users(user_id,
                            name,
                            phone,
                            type,
                            offerscount,
                            friendliness,
                            satisfaction,
                            accountcreated)
                        VALUES(
                                ${user_id},
                                '${name}',
                                '${phone}',
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
                        });
                    }
                });    
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: user_id, name, phone, type, offerscount, friendliness, satisfaction and accountcreated are required!'
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