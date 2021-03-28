import {Request, Response} from 'express';
import connection from "../../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            external_id,
            url,
            title,
            price,
            currency,
            locality,
            date,
            type,
            shipping,
            description,
        } = req.body;

        if (id &&
            external_id &&
            url &&
            title &&
            price &&
            currency &&
            locality &&
            date &&
            type &&
            shipping &&
            description) {
                console.log(date);
                const updateOffer = `UPDATE Offers SET external_id = ${external_id},
                                        url = '${url}',
                                        title = '${title}',
                                        price = ${price},
                                        currency = '${currency}',
                                        locality = '${locality}',
                                        date = '${date}',
                                        type = '${type}',
                                        shipping = '${shipping}',
                                        description = '${description}'    
                                        WHERE id=${id}`;
                connection.query(updateOffer, (err, result) => {
                    if (err) res.json({
                        code: 500,
                        message: 'Couldn\'t updated the offer',
                        error: process.env.DEBUG && err
                    });
                    else {
                        res.json({
                            code: 200,
                            message: 'Offer updated!'
                        });
                    }
                })


        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: id, external_id, url, title, price, currency, locality, date, type, shipping and description are required!'
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