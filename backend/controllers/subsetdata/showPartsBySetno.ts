import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {setnumber: setnumber} = req.params;
    const showAll = `SELECT 
    Subsets.match_no as match_no, 
    p.thumbnail_url as thumbnail_url,
    p.no as part_no,
    Subsets.name as name,
    Subsets.type as type,
    Subsets.category_id as category_id,
    Subsets.color_id as color_id,
    c.color_name as color_name,
    Subsets.quantity as quantity,
    p.qty_avg_price_stock as qty_avg_price_stock,
    p.qty_avg_price_sold as qty_avg_price_sold,
    Subsets.extra_quantity as extra_quantity,
    Subsets.is_alternate as is_alternate,
    Subsets.is_counterpart as is_counterpart,
    st.name as status_name, 
    st.description as status_description 
    FROM Subsets  
    LEFT JOIN Colors c ON c.color_id = Subsets.color_id
    LEFT JOIN Parts p ON Subsets.no = p.no AND Subsets.color_id = p.color_id
    LEFT JOIN Status st ON p.status = st.id AND st.typeid = 1
    WHERE Subsets.SetNo = ${setnumber} 
    ORDER BY CONCAT (c.color_name, ' ',Subsets.name)`
    connection.query(showAll, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Subsetdata for setno',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json({
                code: 200,
                result
            });
        }
    })
}