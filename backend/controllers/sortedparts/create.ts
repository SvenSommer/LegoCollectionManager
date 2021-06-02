import {Request, Response} from 'express';
import connection from "../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        let {
            expectedpart_id,
            identifiedpart_id,
            run_id,
            detected
        } = req.body;

        if (expectedpart_id && 
            run_id &&
            detected) {
                if(identifiedpart_id === undefined) identifiedpart_id = "NULL";
                const createSortedParts = `INSERT INTO SortedParts (
                                            expectedpart_id,
                                            identifiedpart_id,
                                            run_id,
                                            detected)
                                            VALUES(
                                                    ${expectedpart_id},
                                                    ${identifiedpart_id},
                                                    ${run_id},
                                                    ${detected})`;
                connection.query(createSortedParts, (err) => {
                    if (err) {
                        console.log(createSortedParts)
                        console.log(err)
                        res.json({
                            code: 500,
                            message: 'Couldn\'t create new SortedPart',
                            errorMessage: process.env.DEBUG && err
                        });
                    }
                    else {
                        const callSP = `CALL IncreaseSortedPartCountInExpectedParts(${expectedpart_id})`;
                        connection.query(callSP, (err) => {
                            if (err) {
                                console.log("callSP",callSP)
                                console.log(err)
                                res.json({
                                code: 500,
                                message: 'Couldn\'t Increase sortedPartCount',
                                errorMessage: process.env.DEBUG && err
                            });
                            } else {
                                res.json({
                                    code: 201,
                                    message: 'new SortedPart created!'
                                });
                            }
                        })
                    }
                })
        } else {
            console.log("sortedpart.create: expectedpart_id, identifiedpart_id, run_id and detected are required!");
            res.json({
                code: 400,
                message: 'expectedpart_id, identifiedpart_id, run_id and detected are required!'
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