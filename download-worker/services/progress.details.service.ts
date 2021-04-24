import axios from "axios";
import { GlobalVariable } from "../config/GlobalVariable";

export function InsertProgressDetail(task_id: any, progress: any, status: any, information: any) {
    axios.post<any>(process.env.API_URL + 'progressdetails', {
        "task_id": task_id,
        "information": information,
        "progress": progress,
        "status": status
    }, { withCredentials: true, headers: { Cookie: GlobalVariable.cookie, 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(data => {
        console.log(data.data);
        if (data.data.code == 200) {
            console.log(data.data.message);
        }
    });
}

export function UpdateTaskStatus(task_id: any, status: any, information: any) {
    axios.put<any>(process.env.API_URL + 'tasks/' + task_id + '/status', {
        "id": task_id,
        "status_id": status,
        "information": information
    }, { withCredentials: true, headers: { Cookie: GlobalVariable.cookie, 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(data => {
        console.log(data.data);
        if (data.data.code == 200) {
            console.log(data.data.message);
        }
    });
}