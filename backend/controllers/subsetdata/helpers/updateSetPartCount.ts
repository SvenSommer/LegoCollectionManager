import connection from "../../../database_connection";

export function UpdateSetPartCount(setnumber: any) {
    const selectPartCount = `SELECT IFNULL(SUM(quantity),0) as parts_count,
    SUM(extra_quantity) as extra_quantity_count,
    SUM(is_alternate) as alternate_count, 
    SUM(is_counterpart) as counterpart_count,
    SUM(p.qty_avg_price_stock) as part_stock_price_sum,
    SUM(p.qty_avg_price_sold) as part_sold_price_sum
    FROM Subsets 
    JOIN Partdata p ON Subsets.no = p.no AND Subsets.color_id = p.color_id
    WHERE p.type = 'PART'
    AND setNo =  ${setnumber}`;
    connection.query(selectPartCount, (err, sumresult: any) => {
        if (err)
            console.log(err);
    
        const updateSetData = `UPDATE Setdata SET complete_part_count = ${sumresult[0].parts_count} WHERE no = ${setnumber}`;
        connection.query(updateSetData, (err) => {
            if (err) {
                console.log("error while updating Sets complete_part_count" + err);
                console.log(updateSetData);
            }
        });

    });
}
