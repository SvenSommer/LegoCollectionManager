import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            sorterid,
            number,
            ip,
            statusurl,
            pressureurl,
            pushurl,
            updateurl,
            status
        } = req.body;

        if (id &&
            sorterid &&
            number &&
            ip &&
            statusurl &&
            pressureurl &&
            pushurl &&
            updateurl &&
            status) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updatePusher = `UPDATE Pushers SET sorterid = ${sorterid},
                                            number = ${number},
                                            ip = '${ip}',
                                            statusurl = '${statusurl}',
                                            pressureurl = '${pressureurl}',
                                            pushurl = '${pushurl}',
                                            updateurl = '${updateurl}',
                                            status = ${status}
                                            WHERE id=${id}`;
                connection.query(updatePusher, (err) => {
                    if (err) {
                        console.log(updatePusher)
                        res.json({
                        code: 500,
                        message: 'Couldn\'t update Pusher',
                        error: process.env.DEBUG && err
                    });
                }
                    else {
                        res.json({
                            code: 200,
                            message: 'Pusher updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 400,
                message: 'all fields are required!'
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