import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {expectedsetid} = req.params;
    const showAll = `SELECT * FROM LegoSorterDB.purchasedparts_basis WHERE expectedset_id = ${expectedsetid};`
    connection.query(showAll, (err, parts) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Purchased Parts',
            errorMessage: process.env.DEBUG && err
        });
        else {
            const showAllSummary = `SELECT * FROM LegoSorterDB.purchased_parts_sumPerExpectedset WHERE expectedset_id = ${expectedsetid};`
            connection.query(showAllSummary, (err, summary) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some error occurred while fetching Purchased Parts',
                    errorMessage: process.env.DEBUG && err
                });
                else {
                    
                    res.json({
                        code: 200,
                        summary,
                        parts
                    });
                }
            })
        }
    })
}