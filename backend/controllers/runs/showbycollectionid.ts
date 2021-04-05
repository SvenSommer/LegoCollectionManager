import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const sumQuery = `SELECT * FROM LegoSorterDB.runs_basis WHERE collection_id = ${collectionid}`
    connection.query(sumQuery, (err, runStatisticResults:any) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Runs summary',
            errorMessage: process.env.DEBUG && err
        });
        const sumQuery = `SELECT * FROM LegoSorterDB.expected_parts_sumParts_perCollectionId
        where collection_id = ${collectionid}`
        connection.query(sumQuery, (err, runsumResults:any) => {
            if (err) res.json({
                code: 500,
                message: 'Some error occurred while fetching runs total summary by collectionid',
                errorMessage: process.env.DEBUG && err
            });
            res.json({
                code: 200,
                summarized : runsumResults,
                runs : runStatisticResults
            });
        });
    })
}