import connection from "../../../database_connection";

export function InsertProgressDetail(task_id: any, progress: any, status: any, information: any) {
    const insertProgressDetail = `INSERT INTO ProgressDetail (
        task_id,
        information,
        progress,
        status,
        created)
        VALUES (
            '${task_id}',
            '${information}',
            ${progress},
            '${status}',
            NOW())`;
    connection.query(insertProgressDetail, (err) => {
        if (err) {
            console.log(insertProgressDetail)
            console.log("ERROR while inserting ProgressDetail: " + err)
        }
    });
}