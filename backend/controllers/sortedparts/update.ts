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
            expectedpart_id,
            identifiedpart_id,
            run_id,
            detected
        } = req.body;

        if (id &&
            expectedpart_id && 
            identifiedpart_id &&
            run_id &&
            detected ) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateSortedSet = `UPDATE SortedParts SET expectedpart_id = ${expectedpart_id},
                                            identifiedpart_id = ${identifiedpart_id},
                                            run_id = ${run_id},
                                            detected = ${detected}
                                            WHERE id= ${id}`;

                connection.query(updateSortedSet, (err) => {
                    if (err) {res.json({
                        code: 500,
                        message: 'Couldn\'t updated the SortedParts',
                        error: err
                    });
                    console.log(updateSortedSet)
                 } else {
                        res.json({
                            code: 200,
                            message: 'SortedParts updated!'
                        });
                    }
                })
            })  
        } else {
            res.json({
                code: 400,
                message: 'id, expectedpart_id, identifiedpart_id, run_id and detected are required!'
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