import axios from "axios";
import e from "express";
import { GlobalVariable } from "../config/GlobalVariable";
import { InsertProgressDetail, UpdateTaskStatus } from "./progress.details.service";
import { GetAndUpsertSetDataByNo } from "../helpers/upsertSetDataByNo";
var async = require("async");

export function GetTaskData() {

  return new Promise(function (resolve, reject) {
    const transport = axios.create({
      withCredentials: true,
    });

    transport.get<any>(process.env.API_URL + 'tasks/type/1/open', { withCredentials: true, headers: { Cookie: GlobalVariable.cookie, 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(async res => {
      //console.log(res.data);
      if (res.data.code == 200) {
        DownloadSetDataMain(res.data.result).then(data => {
          resolve(data);
        });
        // resolve(true);
      }
      else {
        reject(false);
      }
    });
  });
}

export function DownloadSetDataMain(data: any) {
  return new Promise(function (resolve, reject) {
    async.eachLimit(data, 2, makeSingleRequest, function (err: any) {
      resolve(true);
    });
  });
}

export function makeSingleRequest(entry: any, callback: any) {

  console.log(entry);
  var obj = JSON.parse(entry.information);

  if (obj.setno) {
    UpdateTaskStatus(entry.id, 2, entry.information);
    InsertProgressDetail(entry.id, 2, "Download Started", entry.information);
    GetAndUpsertSetDataByNo(obj.setno, GlobalVariable.userId, entry.id, entry.information).then(function (data) {
      InsertProgressDetail(entry.id, 100, "Download Completed", entry.information);
      UpdateTaskStatus(entry.id, 3, entry.information);
      callback();
    }, function (reason) {
      UpdateTaskStatus(entry.id, 4, entry.information);
      callback();
    });
  }
  else {
    UpdateTaskStatus(entry.id, 4, entry.information);
    callback();
  }
};