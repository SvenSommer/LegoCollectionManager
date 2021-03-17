import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {collectionid} = req.params;
    const showSuggestedSetsByCollectionId = `SELECT collection_id, 
    parts_partNos, 
    parts_color_ids, 
    parts_imageurls,
    parts_thumbnail_urls,
    setNo, 
    count, 
    s_id, 
    no, 
    name, category_name, year, weight_g, size, complete_part_count, complete_minifigs_count, min_price, max_price, avg_price, qty_avg_price, unit_quantity, total_quantity, thumbnail_url, image_url, created, parts_existing, complete_percentage 
    FROM LegoSorterDB.suggested_sets_detail_view 
    WHERE count > (SELECT ROUND(max(count)*0.7,0) FROM LegoSorterDB.suggested_sets_detail_view
    WHERE collection_id = 1)  AND
     setNo IS NOT NULL 
    AND collection_id = ${collectionid} 
    ORDER by complete_percentage desc`
    connection.query(showSuggestedSetsByCollectionId, (err, setsResult) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching recognised Sets',
            errorMessage: process.env.DEBUG && err
        });
        else {
            res.json({
            code: 200,
            setsResult : setsResult
        });

        }
    })
}
//
