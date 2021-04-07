import {Request, Response} from 'express';
import connection from "../../database_connection";
import { UpsertPartDataByNo } from '../partdata/helpers/upsertPartData';

export default (req: Request, res: Response) => {
    const {collectionid: collectionid} = req.params;
    const showPartsByRunId = `
    SELECT partNo,color_id, name, image_url, thumbnail_url, downloaded_sets, part_in_sets_of_collection, super_set_count FROM LegoSorterDB.unsetted_parts WHERE collection_id = ${collectionid}`
    connection.query(showPartsByRunId, (err, result:any) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Identified Parts',
            errorMessage: process.env.DEBUG && err
        });
        else {
            result.forEach(function(row:any) {
                if(row.name == undefined)
                    UpsertPartDataByNo(row.partNo, row.color_id, "PART", res, 0);
            });



            res.json({
                code: 200,
                result
            });
        }
    })
}