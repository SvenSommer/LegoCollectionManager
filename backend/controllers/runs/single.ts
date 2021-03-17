import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {id} = req.params;
    const showSingle = `SELECT allparts_specific.run_id,
    allparts_specific.no,
    allparts_specific.collection_id,
    allparts_specific.sorter_id,
    allparts_specific.imagefolder,
    allparts_specific.status_name,
    allparts_specific.status_description,
    allparts_specific.status_reason,
    allparts_specific.parts_unidentified,
    allparts_specific.parts_deleted,
    allparts_specific.parts_identified,
    allparts_specific.parts_identified_by_human,
    allparts_specific.parts_identified_by_cnn,
    uniqueparts_specific.parts_uniquepartsidentified,
    allparts_specific.created,
    allparts_specific.createdBy
        FROM (
    SELECT r.id as run_id,
    r.no,
    r.collection_id,
    r.sorter_id,
    r.imagefolder,
    st.name as status_name,
    st.description as status_description,
    rs.reason as status_reason,
    r.created as created,
    r.createdBy,
    SUM(IF(rp.deleted IS NULL AND rp.no IS NULL,1,0)) as parts_unidentified,
    SUM(IF(rp.deleted IS NOT NULL,1,0)) as parts_deleted,
    SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL,1,0)) as parts_identified, 
    SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL AND rp.identifier = 'human',1,0)) as parts_identified_by_human, 
    SUM(IF(rp.deleted IS NULL AND rp.no IS NOT NULL AND rp.identifier != 'human',1,0)) as parts_identified_by_cnn
    FROM LegoSorterDB.Recognisedparts rp
    LEFT JOIN LegoSorterDB.Runs r ON r.id = rp.run_id
    LEFT JOIN LegoSorterDB.RunStatus rs ON r.id = rs.run_id AND rs.created = (SELECT MAX(created) FROM LegoSorterDB.RunStatus WHERE run_id = ${id})
    LEFT JOIN LegoSorterDB.Status st ON rs.status = st.code AND st.typeid = 4  
    where rp.run_id = ${id}
    GROUP BY r.id, status_name, status_description, rs.reason, created) As allparts_specific
    JOIN (SELECT COUNT(*) as parts_uniquepartsidentified , parts_uniquepartsidentified.run_id FROM (SELECT COUNT(*), r.id as run_id FROM LegoSorterDB.Recognisedparts rp
    LEFT JOIN LegoSorterDB.Runs r ON r.id = rp.run_id
    WHERE deleted IS NULL AND rp. no IS NOT NULL 
    AND run_id =${id}
    GROUP BY rp.no, run_id) as parts_uniquepartsidentified
    GROUP BY run_id) as uniqueparts_specific
    ON allparts_specific.run_id = uniqueparts_specific.run_id;`
    connection.query(showSingle, (err, result) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching Runs',
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