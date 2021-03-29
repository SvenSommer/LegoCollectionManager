import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            offer_id,
            imageurl,
            downloadedpath
        } = req.body;

        if (offer_id &&
            imageurl &&
            downloadedpath) {
                const createImage = `INSERT INTO Offers_Images(offer_id,
                    imageurl,
                    downloadedpath)
                VALUES(
                        ${offer_id},
                        '${imageurl}',
                        '${downloadedpath}')`;
                connection.query(createImage, (err1, result1) => {
                    if (err1) res.json({
                        code: 500,
                        message: 'Couldn\'t create the Image information',
                        errorMessage: process.env.DEBUG && err1
                    });
                    else {
                        res.json({
                            code: 201,
                            message: 'Image information added!'
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: offerid, imageurl and downloadedpath are required!'
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