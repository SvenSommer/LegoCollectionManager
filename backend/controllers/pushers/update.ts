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
            scaleid,
            valveid,
            number,
            name,
            distanceFromOrigin_mm,
            pushurl,
            status
        } = req.body;

        if (id &&
            scaleid &&
            valveid &&
            number &&
            name &&
            distanceFromOrigin_mm &&
            pushurl &&
            status) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updatePusher = `UPDATE Pushers SET scaleid = ${scaleid},
                                            valveid = ${valveid},
                                            number = ${number},
                                            name = '${name}',
                                            distanceFromOrigin_mm = ${distanceFromOrigin_mm},
                                            pushurl = '${pushurl}',
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
                message: 'id, scaleid, valveid, number, name, distanceFromOrigin_mm, pushurl an status are required!'
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