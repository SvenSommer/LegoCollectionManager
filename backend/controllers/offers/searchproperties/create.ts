import {Request, Response} from 'express';
import connection from "../../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            searchterm,
            location,
            pricemin,
            pricemax,
            onlypickup,
            active
        } = req.body;

        if (searchterm &&
            location &&
            active) {
                const createSearchterm = `INSERT INTO Offers_Searchproperties(searchterm,
                    location,
                    pricemin,
                    pricemax,
                    onlypickup,
                    active)
                VALUES(
                        '${searchterm}',
                        '${location}',
                         ${pricemin},
                         ${pricemax},
                         ${onlypickup},
                        ${active})`;
                connection.query(createSearchterm, (err, result:any) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t create the Searchterm',
                        errorMessage: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 201,
                            message: `Searchterm with searchterm_id ${result.insertId} created!`,
                            searchterm_id: result.insertId
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: searchterm, location and active are required!'
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