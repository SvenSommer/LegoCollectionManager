import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id: collectionid} = req.params;
    const showOne = `SELECT * FROM LegoSorterDB.collection_detail WHERE id=${collectionid};`
    connection.query(showOne, (err, result) => {
        if (err) {
            console.log(err)
            res.json({
            code: 500,
            message: 'Some error occurred while fetching Collection details',
            errorMessage: process.env.DEBUG && err
        });
    }else {
            res.json({
                code: 200,
                result
            });
        }
    })
}