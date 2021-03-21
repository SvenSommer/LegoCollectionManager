import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            ip,
            sorterid,
            number,
            name,
            statusurl,
            initializeurl,
            tareurl,
            reseturl,
            expectBrickurl,
            status
        } = req.body;

        if (ip &&
            sorterid &&
            number &&
            name &&
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
                        const createScales = `INSERT INTO Scales(
                            ip,
                            sorterid,
                            number,
                            name,
                            statusurl,
                            initializeurl,
                            tareurl,
                            reseturl,
                            expectBrickurl,
                            status,            
                            createdBy)
                            VALUES(
                             '${ip}',
                             ${sorterid}, 
                             ${number}, 
                             '${name}',
                            '${statusurl}',
                            '${initializeurl}',
                            '${tareurl}',
                            '${reseturl}',
                            '${expectBrickurl}',
                             ${status},
                             ${userid}
                            )`;
                        connection.query(createScales, (err) => {
                            if (err) {
                                console.log(createScales)
                                res.json({
                                code: 500,
                                message: 'Couldn\'t create new Scale',
                                errorMessage: process.env.DEBUG && err
                                });

                            }
                            else {
                                res.json({
                                    code: 201,
                                    message: 'new Scale created'
                                });
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'ip, number, name and status are required!'
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