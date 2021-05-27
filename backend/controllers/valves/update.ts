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
            name,
            ip,
            valvesCount,
            statusurl,
            pressureurl,
            updateurl,
            status
        } = req.body;

        if (id &&
            sorterid &&
            number &&
            name &&
            ip &&
            valvesCount &&
            status) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updatePusher = `UPDATE Valves SET sorter_id = ${sorterid},
                                        number = ${number},
                                        name = '${name}',
                                        ip = '${ip}',
                                        valvesCount = ${valvesCount},
                                        statusurl = '${statusurl}',
                                        pressureurl = '${pressureurl}',
                                        updateurl = '${updateurl}',
                                        status = ${status}
                                        WHERE id=${id}`;
                connection.query(updatePusher, (err) => {
                    if (err) {
                        console.log(updatePusher)
                        res.json({
                        code: 500,
                        message: 'Couldn\'t update Valves',
                        error: process.env.DEBUG && err
                    });
                }
                    else {
                        res.json({
                            code: 200,
                            message: 'Valves updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 400,
                message: 'id, sorterid, number, name, ip, valvesCount and status are required!'
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