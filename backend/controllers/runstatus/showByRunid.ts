import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {runid: runid} = req.params;
    const showAll = `SELECT rs.id, rs.status,  s.name, s.description, rs.reason, u.username, 
    rs.created   FROM RunStatus rs 
    LEFT JOIN Status s ON s.typeid = 4 And s.code = rs.status
    LEFT JOIN Users u On u.id = rs.createdBy 
    where run_id = ${runid}
    order by rs.created desc`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching RunStatus',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json({
                code: 200,
                result
            });
        }
    })
}