import { Response } from 'express';
import connection from "../../../database_connection";

export function UpdateSetMinifigCount(setnumber: any) {
    const selectminifigCount = `SELECT IFNULL(SUM(quantity),0) as minifigs_count,
    IFNULL(SUM(p.qty_avg_price_stock),0) as part_stock_price_sum,
    IFNULL(SUM(p.qty_avg_price_sold),0) as part_sold_price_sum
    FROM Subsets 
    JOIN Parts p ON Subsets.no = p.no AND Subsets.color_id = p.color_id
    WHERE p.type = 'MINIFIG'
    AND setNo = ${setnumber}`;

    connection.query(selectminifigCount, (err, sumresult: any) => {
        if (err)
            console.log(err);

        const updateSetData = `UPDATE Sets SET complete_minifigs_count = ${sumresult[0].minifigs_count} WHERE no = ${setnumber}`;

        connection.query(updateSetData, (err) => {
            if (err) {
                console.log("error while updating Sets complete_minifigs_count" + err);
                console.log(updateSetData);
            }
        });

    });
}
