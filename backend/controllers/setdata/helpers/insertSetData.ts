import { Response } from 'express';
import connection from "../../../database_connection";

export function InsertSetData(setnumber: any, setinfo: any, priceinfo: any, id: any, res: Response<any, Record<string, any>>) {
    const createSetData = `INSERT INTO Sets (
                                            no,
                                            name,
                                            category_id,
                                            year,
                                            weight_g,
                                            size,
                                            min_price,
                                            max_price,
                                            avg_price,
                                            qty_avg_price,
                                            unit_quantity,
                                            total_quantity,
                                            thumbnail_url,
                                            image_url,
                                            created,
                                            createdBy)
                                            VALUES(
                                            '${setnumber}',
                                            '${setinfo.name}',
                                             ${setinfo.category_id},
                                            '${setinfo.year_released}',
                                             ${setinfo.weight},
                                            '${setinfo.dim_x} x ${setinfo.dim_y} x ${setinfo.dim_z} cm',
                                             ${priceinfo.min_price},
                                             ${priceinfo.max_price},
                                             ${priceinfo.avg_price},
                                             ${priceinfo.qty_avg_price},
                                             ${priceinfo.unit_quantity},
                                             ${priceinfo.total_quantity},
                                            '${setinfo.thumbnail_url}',
                                            '${setinfo.image_url}',
                                             NOW(),
                                             ${id}
                                            )`;
    connection.query(createSetData, (err) => {
        if (err)
            res.json({
                code: 500,
                message: 'Couldn\'t store downloaded Setdata.',
                errorMessage: process.env.DEBUG && err
            });
    });
}
