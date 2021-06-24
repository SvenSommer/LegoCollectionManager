import axios from 'axios';
import { GlobalVariable } from '../config/GlobalVariable';

export function Login(username: any, password: any): Promise<any> {
  return new Promise(function (resolve, reject) {
    const transport = axios.create({
      withCredentials: true,
    });
    let baseurl = 'http://' + process.env.API_URL + ':' + process.env.API_PORT  
    if(process.env.DEBUG == "True") console.log("making post request to " + baseurl + '/users/login')
    transport.post<any>(baseurl + '/users/login', {
      "username": username,
      "password": password
    }, { withCredentials: true, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(data => {
      if (data.data.code == 200) {
        if(process.env.DEBUG == "True") console.log(data.data.message);
        GlobalVariable.cookie = data.headers['set-cookie'][0];
        resolve(true);
      }
      else {
        console.log(data)
        reject(false);
      }
    });
  });
}