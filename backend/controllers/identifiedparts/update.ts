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
            run_id,
            no,
            color_id,
            score,
            identifier,
        } = req.body;

        if (run_id && 
            no &&
            score && 
            identifier) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateIdentifiedparts = `UPDATE Identifiedparts SET run_id = ${run_id},
                                            no = '${no}',
                                            color_id = ${color_id},
                                            score = ${score},
                                            identifier = '${identifier}'
                                            WHERE id= ${id}`;
                console.log(updateIdentifiedparts)
                connection.query(updateIdentifiedparts, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the Identified Parts',
                        error: err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Identified Parts updated!'
                        });
                    }
                })
            })  
        } else {
            res.json({
                code: 400,
                message: 'id, run_id, no, color_id, score and identifier are required!'
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