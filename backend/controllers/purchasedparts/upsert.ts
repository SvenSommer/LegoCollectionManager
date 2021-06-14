import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            orderitem_id,
            expectedpart_id,
            quantity,
        } = req.body;

        if (orderitem_id &&
            expectedpart_id &&
            quantity  ) {
                const findExistingEntry = `SELECT * FROM PurchasedParts WHERE orderitem_id = ${orderitem_id} AND expectedpart_id = ${orderitem_id}`;
                connection.query(findExistingEntry, (err, result: any) => {
                    if (err) res.json({
                        code: 400,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        if (result == 'undefined' || result.length == 0) {
                            const createPart = `INSERT INTO PurchasedParts(orderitem_id,
                                expectedpart_id,
                                quantity)
                                VALUES(
                                       ${orderitem_id},
                                       ${expectedpart_id},
                                       ${quantity})`;
                                connection.query(createPart, (err1, result) => {
                                            if (err1) res.json({
                                                code: 500,
                                                message: 'Couldn\'t create new Purchased Part',
                                                errorMessage: process.env.DEBUG && err1
                                            });
                                            else {
                                                res.json({
                                                    code: 201,
                                                    message: 'new Purchasedpart created'
                                                });
                                            }
                                    
                                    })
                        }
                        else{
                            res.json({
                                code: 201,
                                message: 'new Purchasedpart updated'
                            });
                        }
                    }

            })
        } else {
            res.json({
                code: 400,
                message: 'username, password, full_name and usergroup are required!'
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