import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const sumQuery = `SELECT * FROM LegoSorterDB.runs_details WHERE collection_id = ${collectionid}`
    connection.query(sumQuery, (err, runStatisticResults:any) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Runs summary',
            errorMessage: process.env.DEBUG && err
        });
        const sumQuery = `SELECT 
        SUM(IF(rp.deleted IS NULL AND rp.no IS NULL,1,0)) as allRunsPartsUnidentified,
        SUM(IF(rp.deleted IS NOT NULL,1,0)) as allRunsPartsDeleted,
        SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL,1,0)) as allRunsPartsIdentified, 
        SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL AND rp.identifier = 'human',1,0)) as allRunsPartsIdentifiedByHuman, 
        SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL AND rp.identifier != 'human',1,0)) as allRunsPartsIdentifiedByCnn
        FROM LegoSorterDB.Recognisedparts rp
        LEFT JOIN LegoSorterDB.Runs r ON r.id = rp.run_id
        where collection_id = ${collectionid}`
        connection.query(sumQuery, (err, runsumResults:any) => {
            if (err) res.json({
                code: 500,
                message: 'Some error occurred while fetching runs total summary',
                errorMessage: process.env.DEBUG && err
            });
            const uniqueQuery = `SELECT COUNT(*) as allRunsUniquePartIdentifedCount FROM (SELECT COUNT(*) FROM LegoSorterDB.Recognisedparts rp
            LEFT JOIN LegoSorterDB.Runs r ON r.id = rp.run_id
            WHERE deleted IS NULL AND rp. no IS NOT NULL 
            AND collection_id = ${collectionid}  
            GROUP BY rp.no) as parts_uniquepartsidentified`
            connection.query(uniqueQuery, (err, runniqueResults:any) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some error occurred while fetching runs total summary',
                    errorMessage: process.env.DEBUG && err
                });
                res.json({
                    code: 200,
                    summarized : runsumResults,
                    unique : runniqueResults,
                    runs : runStatisticResults
                });
            });
        });
    })
}