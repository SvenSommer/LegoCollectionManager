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
            name,
            ip,
            valvesCount,
            statusurl,
            pressureurl,
            updateurl,
            status
        } = req.body;

        if (sorterid &&
            number &&
            name &&
            ip &&
            valvesCount &&
            status) {
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
                        const Valves = `INSERT INTO Valves(
                            sorterid,
                            number,
                            name,
                            ip,
                            valvesCount,
                            statusurl,
                            pressureurl,
                            updateurl,
                            status,            
                            createdBy)
                            VALUES(
                             ${sorterid},
                             ${number},
                            '${name}',
                            '${ip}',
                             ${valvesCount},
                            '${statusurl}',
                            '${pressureurl}',
                            '${updateurl}',
                             ${status},
                             ${userid}
                            )`;
                        connection.query(Valves, (err) => {
                            if (err) {
                                console.log(Valves)
                                res.json({
                                code: 500,
                                message: 'Couldn\'t create new Valve',
                                errorMessage: process.env.DEBUG && err
                                });
                            }
                            else {
                                res.json({
                                    code: 201,
                                    message: 'new Valve created'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'sorterid, number, name, ip, valvesCount and status are required!'
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