import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    try {
        const {
            external_id,
            url,
            searchproperties_id,
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
            user_id,
            description
        } = req.body;
        if (external_id 
          /*   url &&
            searchproperties_id &&
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
            user_id &&
            description */
            ) {
                const createOffer = `INSERT INTO Offers
                (external_id,
                url,
                searchproperties_id,
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
                user_id,
                description)
                VALUES(
                        ${external_id},
                        '${url}',
                        '${searchproperties_id}',
                        '${title.replace("'","`").replace("'","`")}',
                         ${price},
                        '${pricetype}',
                        '${currency}',
                        '${locationgroup.replace("'","`").replace("'","`")}',
                        '${locality.replace("'","`").replace("'","`")}',
                        '${zipcode.replace("'","`").replace("'","`")}',
                        '${datecreated}',
                        '${type}',
                        '${shipping}',
                         ${user_id},
                        '${description.replace("'","`").replace("'","`")}')`;
                connection.query(createOffer, (err, result:any) => {
                    if (err){ 
                        console.log(createOffer)
                        res.json({
                        code: 500,
                        message: 'Couldn\'t create the offer',
                        errorMessage: process.env.DEBUG && err
                        });
                    }else {
                        res.json({
                            code: 201,
                            message: `Offer with offer_id ${result.insertId} created!`,
                            offer_id: result.insertId
                        });
                    }
                })
        } else {
            res.json({
                code: 400,
                message: 'Missing Parameter: external_id, url, searchterm, title, price, pricetype, currency, locationgroup, locality, zipcode, date, type, shipping, user_id and description are required!'
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