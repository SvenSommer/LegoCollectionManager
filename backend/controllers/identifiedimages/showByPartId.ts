import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {partid: partid} = req.params;
    const showOneByRunId = `SELECT * FROM Identifiedimages ri
                                            LEFT JOIN Partimages pi ON ri.image_id = pi.id
                                            WHERE ri.part_id =  ${partid} `
    connection.query(showOneByRunId, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Identified Image',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json({
                code: 200,
                result
            });
        }
    })
}