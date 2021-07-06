import axios from "axios";
import { GlobalVariable } from "../config/GlobalVariable";

export function InsertProgressDetail(task_id: any, progress: any, status: any, information: any) {
    let baseurl = 'http://' + process.env.API_URL + ':' + process.env.API_PORT  
    axios.post<any>(baseurl + '/progressdetails', {
        "task_id": task_id,
        "information": information,
        "progress": progress,
        "status": status
    }, { withCredentials: true, headers: { Cookie: GlobalVariable.cookie, 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(data => {
        //console.log(data.data);
        if (data.data.code == 200) {
          //  console.log(data.data.message);
        }
    });
}

export function UpdateTaskStatus(task_id: any, status: any, information: any) {
    let baseurl = 'http://' + process.env.API_URL + ':' + process.env.API_PORT  
    axios.put<any>(baseurl + '/tasks/' + task_id + '/status', {
        "id": task_id,
        "status_id": status,
        "information": information
    }, { withCredentials: true, headers: { Cookie: GlobalVariable.cookie, 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(data => {
        if (data.data.code != 200) {
            //console.log(data.data.message);
        }
    });
}