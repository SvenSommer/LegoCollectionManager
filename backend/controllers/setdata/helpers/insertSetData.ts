/* import { Response } from 'express';
import connection from "../../../database_connection";

export function InsertSetData(setnumber: any, setinfo: any, priceinfo: any, id: any): Promise<any> {
    return new Promise(function (resolve, reject) {
        const createSetData = `INSERT INTO Setdata (
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
            '${setinfo.name.replace("'", "`").replace("'", "`")}',
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
            if (err) {
                console.log(createSetData)
                console.log(err);
                reject(err);
            }
            else{
                resolve(true);
            }
        });
    });
}
 */