import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            searchterm,
            location,
            pricemin,
            pricemax,
            onlypickup,
            active
        } = req.body;

        if (id &&
            searchterm &&
            location &&
            active ) {
                const updateOfferSearchterm = `UPDATE Offers_Searchproperties SET searchterm = '${searchterm}',
                                        location = '${location}',
                                        pricemin = ${pricemin},
                                        pricemax = ${pricemax},
                                        onlypickup = ${onlypickup},
                                        active = ${active}
                                        WHERE id=${id}`;
                connection.query(updateOfferSearchterm, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the offer searchterm',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Offer searchterm updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, searchterm, location and active are required!'
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