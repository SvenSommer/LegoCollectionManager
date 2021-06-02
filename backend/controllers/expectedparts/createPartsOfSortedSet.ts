import {Request, Response} from 'express';
//@ts-ignore
import connection from "../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            expectedset_id,
            setnumber
        } = req.body;

        if (expectedset_id && 
            setnumber) {
                const callSP = `CALL AddExpectedPartsForSetno(${expectedset_id},${setnumber})`;
                connection.query(callSP, (err, result: any) => {
                    if (err) {
                        console.log(callSP)
                        res.json({
                        code: 500,
                        message: 'Some error occurred while adding expectedparts for setnumber!',
                        errorMessage: process.env.DEBUG && err
                    });}
                    else {
                        res.json({
                            code: 201,
                            message: 'ExpectedParts for Set added!',
                            parts_added: result.affectedRows
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'expectedset_id and setnumber are required!'
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