import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id: collectionid} = req.params;
    const showAllCollections = `SELECT * FROM LegoSorterDB.collections_basis WHERE id=${collectionid};`
    connection.query(showAllCollections, (err, generalproperties:any) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching collections',
            errorMessage: process.env.DEBUG && err
        });
        else {
            const sumQuery = `SELECT *  FROM LegoSorterDB.collection_sumProperties
            WHERE collection_id = ${collectionid}`
            connection.query(sumQuery, (err, summarizedResults:any) => {
                if (err) res.json({
                    code: 500,
                    message: 'Some error occurred while fetching recognised Sets summary',
                    errorMessage: process.env.DEBUG && err
                });

                const uniquePartsQuery = `SELECT COUNT(*) as allSetsUniquePartCount FROM (
                    SELECT COUNT(*) as count, ss.no FROM LegoSorterDB.Recognisedsets rs
                    LEFT JOIN LegoSorterDB.Setdata s ON s.no = rs.setNo
                         LEFT JOIN LegoSorterDB.Subsets ss ON s.no = ss.Setno
                         WHERE rs.collection_id = ${collectionid}
                         GROUP BY ss.no
                         ORDER by count desc) as x`
                connection.query(uniquePartsQuery, (err, uniquePartsResults:any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Some error occurred while fetching unique Parts count',
                        errorMessage: process.env.DEBUG && err
                    });
                    res.json({
                        code: 200,
                        general : generalproperties[0],
                        summarized : summarizedResults[0],
                        unique : uniquePartsResults[0]
                    });
                });
            });
        }
    })
}