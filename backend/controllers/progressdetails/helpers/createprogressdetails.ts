import connection from "../../../database_connection";

export function InsertProgressDetail(request_id: any, progress: any, status: any) {
    const insertSubSetData = `INSERT INTO ProgressDetail (
        request_id,
        progress,
        status,
        created)
        VALUES (
            '${request_id}',
            ${progress},
            '${status}',
            NOW())`;
    connection.query(insertSubSetData, (err) => {
        if (err) {
            console.log("ERROR while inserting subsetdata: " + err)
        }
    });
}