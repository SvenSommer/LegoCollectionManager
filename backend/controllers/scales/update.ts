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
            ip,
            number,
            name,
            statusurl,
            initializeurl,
            tareurl,
            reseturl,
            expectBrickurl,
            status
        } = req.body;

        if (id &&
            sorterid && 
            ip &&
            number &&
            name &&
            status) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateScale = `UPDATE Scales SET ip = '${ip}',
                                            sorterid = ${sorterid},
                                            number = ${number},
                                            name = '${name}',
                                            statusurl = '${statusurl}',
                                            initializeurl = '${initializeurl}',
                                            tareurl = '${tareurl}',
                                            reseturl = '${reseturl}',
                                            expectBrickurl = '${expectBrickurl}',
                                            status = ${status}
                                            WHERE id=${id}`;
                connection.query(updateScale, (err) => {
                    if (err) {
                        console.log(updateScale)
                        res.json({
                        code: 500,
                        message: 'Couldn\'t update Scale',
                        error: process.env.DEBUG && err
                    });
                }
                    else {
                        res.json({
                            code: 200,
                            message: 'Scale updated!'
                        });
                    }
                })

            })
        } else {
            res.json({
                code: 400,
                message: 'id, ip, number, number, name and status are required!'
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