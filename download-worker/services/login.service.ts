import axios from 'axios';
import { GlobalVariable } from '../config/GlobalVariable';

export function Login(username: any, password: any): Promise<any> {
  return new Promise(function (resolve, reject) {
    const transport = axios.create({
      withCredentials: true,
    });
    transport.post<any>('http://localhost:3001/users/login', {
      "username": username,
      "password": password
    }, { withCredentials: true, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(data => {
      console.log(data.data);
      if (data.data.code == 200) {
        console.log(data.data.message);
        GlobalVariable.cookie = data.headers['set-cookie'][0];
        resolve(true);
      }
      else {
        reject(false);
      }
    });
  });
}