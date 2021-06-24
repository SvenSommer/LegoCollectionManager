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
            expectedset_id,
            pusher_id
        } = req.body;

        if (id &&
            run_id && 
            expectedset_id &&
            pusher_id ) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updaterunnedSet = `UPDATE RunnedSets SET run_id = ${run_id},
                expectedset_id = ${expectedset_id},
                                            pusher_id = ${pusher_id}
                                            WHERE id= ${id}`;

                connection.query(updaterunnedSet, (err, result) => {
                    if (err) {res.json({
                        code: 500,
                        message: 'Couldn\'t updated the runnedset',
                        error: err
                    });
                    console.log(updaterunnedSet)
                 } else {
                        res.json({
                            code: 200,
                            message: 'RunnedSet updated!'
                        });
                    }
                })
            })  
        } else {
            res.json({
                code: 400,
                message: 'id, run_id, expectedset_id and pusher_id are required!'
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