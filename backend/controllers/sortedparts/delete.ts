import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {expectedpartid} = req.params;
    const markDeleted = `DELETE FROM SortedParts WHERE expectedpart_id = ${expectedpartid} 
    AND created = (SELECT created FROM (SELECT MAX(created) as created FROM SortedParts WHERE expectedpart_id = ${expectedpartid} ) t1 ) LIMIT 1;`
    connection.query(markDeleted, (err, result) => {
        if (err) { 
            console.log("markDeleted",markDeleted)
            console.log(err)
            res.json({
            code: 500,
            message: 'Some error occurred while marking partimage as deleted',
            errorMessage: process.env.DEBUG && err
        });
        } else {
            const callSP = `CALL DecreaseSortedPartCountInExpectedParts(${expectedpartid})`;
            connection.query(callSP, (err) => {
                if (err) {
                    console.log("callSP",callSP)
                    console.log(err)
                    res.json({
                    code: 500,
                    message: 'Couldn\'t Decrease sortedPartCount',
                    errorMessage: process.env.DEBUG && err
                });
                } else {
                    res.json({
                        code: 201,
                        message: 'SortedPart deleted!'
                    });
                }
            })
        }
    })
}