import {Request, Response} from 'express';
import connection from "../../../database_connection";
import { InsertTask } from '../../tasks/helpers/createTask';

export default (req: Request, res: Response) => {
    try {
        const {
            offer_id,
            imageurl,
         path
        } = req.body;

        if (offer_id &&
            imageurl &&
            path) {
                const createImage = `INSERT INTO Offers_Images(offer_id,
                    imageurl,
                    path)
                VALUES(
                        ${offer_id},
                        '${imageurl}',
                        '${path}')`;
                connection.query(createImage, (err1, result:any) => {
                    if (err1) res.json({
                        code: 500,
                        message: 'Couldn\'t create the Image information',
                        errorMessage: process.env.DEBUG && err1
                    });
                    else {
                        const origin = {
                            origin : offer_id
                        }
                        const information = {
                            image_id : result.insertId,
                            imageurl : imageurl,
                            path : path
                        }
                        InsertTask(2,JSON.stringify(origin),JSON.stringify(information))
                        res.json({
                            code: 201,
                            message: 'Image information and Detection Task added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: offer_id, imageurl and path are required!'
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