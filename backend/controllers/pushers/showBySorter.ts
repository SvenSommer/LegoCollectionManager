import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {sorterid} = req.params;
  //  const showAll = `SELECT * FROM Pushers p LEFT JOIN Valves v ON v.id = p.valveid
  //  WHERE sorterid = ${sorterid};`
      const showAll = `SELECT * FROM pushers_basis
    WHERE sorter_id = ${sorterid};`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Sorters',
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