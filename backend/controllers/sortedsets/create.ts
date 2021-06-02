import { Console } from 'console';
import {Request, Response} from 'express';
//@ts-ignore
import jwt from 'jsonwebtoken';
import connection from "../../database_connection";
import {Token_encodeInterface} from '../middleware/token_encode.interface';


export default (req: Request, res: Response) => {
    try {
        const {token} = req.cookies;
        const {
            run_id,
            expectedset_id,
            setno,
            pusher_id
        } = req.body;

        if (run_id && 
            expectedset_id && 
            setno &&
            pusher_id) {
            //@ts-ignore
            jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded: Token_encodeInterface) => {
                const {username} = decoded;
                const findUserInDB = `SELECT * FROM Users WHERE username='${username}'`;
                connection.query(findUserInDB, (err, result: any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some Error Occurred!',
                        //@ts-ignore
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        const {id:userid} = result[0];
                        const createSortedSet = `INSERT INTO SortedSets (
                                                  run_id,
                                                  expectedset_id,
                                                  setNo,
                                                  pusher_id,
                                                  createdBy)
                                                  VALUES(
                                                          ${run_id},
                                                          ${expectedset_id},
                                                          ${setno},
                                                          ${pusher_id},
                                                          ${userid})`;
                        connection.query(createSortedSet, (err) => {
                            if (err) {
                                console.log("createSortedSet",createSortedSet)
                                console.log(err)
                                res.json({
                                code: 500,
                                message: 'Couldn\'t create the SortedSets',
                                errorMessage: process.env.DEBUG && err
                            });
                        } else {
                                //Create SortedParts for this expectedset_id if the entry for this set was not yet placed (expectedset_id entries available)
                               const callSP = `CALL AddExpectedPartsForSetno(${expectedset_id},${setno})`;
                               connection.query(callSP, (err) => {
                                    if (err) {
                                        console.log("callSP",callSP)
                                        console.log(err)
                                        res.json({
                                        code: 500,
                                        message: 'Couldn\'t create ExpectedParts for SortedSets',
                                        errorMessage: process.env.DEBUG && err
                                    });
                                    } else {
                                        res.json({
                                            code: 201,
                                            message: 'new SortedSet created!'
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            })
        } else {
            res.json({
                code: 400,
                message: 'run_id, expectedset_id, setno and pusher_id are required!'
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