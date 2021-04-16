import connection from "../../../database_connection";
import { PriceParams } from "../../../models/model";

export function InsertPriceData(userid: string, priceParams: PriceParams): Promise<any> {
    return new Promise(function (resolve, reject) {
        const { type, partnumber, colorid, guide_type, priceinfo, region } = priceParams;

        const insertPrices = `INSERT INTO Pricedata (
            no,
            type,
            new_or_used,
            color_id,
            region,
            guide_type,
            currency_code,
            min_price,
            max_price,
            avg_price,
            qty_avg_price,
            unit_quantity,
            total_quantity,
            created,
            createdBy)
            VALUES(
            '${partnumber}',
            '${type}',
            '${priceinfo.new_or_used}',
                ${colorid},
            '${region}',
            '${guide_type}',
            '${priceinfo.currency_code}',
                ${priceinfo.min_price},
                ${priceinfo.max_price},
                ${priceinfo.avg_price},
                ${priceinfo.qty_avg_price},
                ${priceinfo.unit_quantity},
                ${priceinfo.total_quantity},
                NOW(),
                ${userid}
            ) ON DUPLICATE KEY UPDATE id=id`;
        connection.query(insertPrices, (err) => {
            if (err)
            {
                reject({
                    code: 500,
                    message: 'Couldn\'t store SoldPrices of the Part.',
                    errorMessage: process.env.DEBUG && err
                });
            }
            else
            {
                resolve(true);
            }
                
        });
    });
}