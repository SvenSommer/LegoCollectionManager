import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            offer_id,
            setno,
            amount,
            comments
        } = req.body;

        if (id &&
            offer_id &&
            setno &&
            amount &&
            comments) {
                const updateOne = `UPDATE Offers_Possiblesets SET offer_id = ${offer_id},
                setno = '${setno}',
                amount = ${amount} ,
                comments = '${comments}' 
                                        WHERE id=${id}`;
                connection.query(updateOne, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the possible set',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Possible set updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, offer_id, setno, amount and comments are required!'
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