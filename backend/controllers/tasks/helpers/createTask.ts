import connection from "../../../database_connection";

export function InsertTask(type_id: any, origin: any, information: any) {
    const createOne = `INSERT INTO Tasks(type_id,
        origin,
        information,
        status_id)
        VALUES(
        ${type_id},
        '${origin}',
        '${information}',
        1)`;
    connection.query(createOne, (err) => {
        if (err) {
            console.log(createOne)
            console.log("ERROR while inserting new Task: " + err)
        }
    });
}