import {Request, Response} from 'express';
import connection from "../../../database_connection";



export default (req: Request, res: Response) => {
    try {
        let {
            id,
            detections
        } = req.body;
        if (id &&
            detections) {   
                const updateOne = `UPDATE Offers_Images SET detections = ` + connection.escape(detections)  + `
                WHERE id=${id}`;
                connection.query(updateOne, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the detections of the image',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Detection updated!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id and detections are required!'
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