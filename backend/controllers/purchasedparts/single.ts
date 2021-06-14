import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {orderitemid} = req.params;
    const showOne = `SELECT * FROM purchasedparts_basis WHERE orderitem_id=${orderitemid};`
    connection.query(showOne, (err, result) => {
        if (err) {
            console.log(err)
            res.json({
            code: 500,
            message: 'Some error occurred while fetching PurchsedParts',
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