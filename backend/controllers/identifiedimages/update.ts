import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';

export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            id,
            image_id,
            part_id,
            score
        } = req.body;

        if (id &&
            image_id &&
            part_id &&
            score) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const updateOne = `UPDATE Identifiedimages SET image_id = ${image_id},
                                            part_id = ${part_id},
                                            score = ${score}
                                            WHERE id= ${id}`;
                console.log(updateOne)
                connection.query(updateOne, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the Identified Image',
                        error: err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'Identified Image updated!'
                        });
                    }
                })
            })  
        } else {
            res.json({
                code: 400,
                message: 'id, image_id, part_id and score are required!'
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