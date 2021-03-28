import {Request, Response} from 'express';
import connection from "../../database_connection";


export default (req: Request, res: Response) => {
    try {
        const {
            id,
            external_id,
            url,
            searchterm,
            title,
            price,
            pricetype,
            currency,
            locationgroup,
            locality,
            zipcode,
            datecreated,
            type,
            shipping,
            userid,
            description
        } = req.body;

        if (id &&
            external_id &&
            url &&
            searchterm &&
            title &&
            price &&
            pricetype &&
            currency &&
            locationgroup &&
            locality &&
            zipcode &&
            datecreated &&
            type &&
            shipping &&
            userid &&
            description) {
                console.log(datecreated);
                const updateOffer = `UPDATE Offers SET external_id = ${external_id},
                                        url = '${url}',
                                        searchterm = '${searchterm.replace("'","`").replace("'","`")}',
                                        title = '${title.replace("'","`").replace("'","`")}',
                                        price = ${price},
                                        pricetype = '${pricetype}',
                                        currency = '${currency}',
                                        locationgroup = '${locationgroup.replace("'","`").replace("'","`")}',
                                        locality = '${locality.replace("'","`").replace("'","`")}',
                                        zipcode = '${zipcode.replace("'","`").replace("'","`")}',
                                        datecreated = '${datecreated}',
                                        type = '${type}',
                                        shipping = '${shipping}',
                                        userid = ${userid},
                                        description = '${description.replace("'","`").replace("'","`")}'
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