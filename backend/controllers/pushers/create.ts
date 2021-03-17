import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            sorterid,
            number,
            ip,
            distanceFromOrigin,
            statusurl,
            pressureurl,
            pushurl,
            updateurl,
            status,
            createdBy
        } = req.body;

        if (sorterid &&
            number &&
            ip &&
            distanceFromOrigin &&
            statusurl &&
            pressureurl &&
            pushurl &&
            updateurl &&
            status &&
            createdBy) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username:currentusernme} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${currentusernme}'`;
                connection.query(findUserInDB, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const {id: userid} = result[0];
                        const createPusher = `INSERT INTO Pushers(
                        sorterid,
                        number,
                        ip,
                        distanceFromOrigin,
                        statusurl,
                        pressureurl,
                        pushurl,
                        updateurl,
                        status,            
                        createdBy)
                        VALUES(
                             ${sorterid},
                             ${number}, 
                            '${ip}',
                             ${distanceFromOrigin},
                            '${statusurl}',
                            '${pressureurl}',
                            '${pushurl}',
                            '${updateurl}',
                             ${status},
                             ${userid}
                            )`;
                        connection.query(createPusher, (err) => {
                            if (err) {
                                console.log(createPusher)
                                res.json({
                                code: 500,
                                message: 'Couldn\'t create new Pusher',
                                errorMessage: process.env.DEBUG && err
                                });

                            }
                            else {
                                res.json({
                                    code: 201,
                                    message: 'new Pusher created'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'sorterid, number, ip, statusurl, pressureurl, pushurl, updateurl, status and createdBy are required!'
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