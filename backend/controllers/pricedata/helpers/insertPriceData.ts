import connection from "../../../database_connection";
import {Response} from 'express';
import { PriceParams } from "../../../models/model";

export function InsertPriceData(res: Response<any, Record<string, any>>, userid: string, priceParams: PriceParams): void {
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
            res.json({
                code: 500,
                message: 'Couldn\'t store SoldPrices of the Part.',
                errorMessage: process.env.DEBUG && err
            });
    });
}