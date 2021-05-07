import axios from "axios";
import { GlobalVariable } from "../config/GlobalVariable";
import { InsertProgressDetail, UpdateTaskStatus } from "./progress.details.service";
import { GetAndUpsertSetDataByNo } from "../helpers/upsertSetDataByNo";
import { GetAndUpsertKnownColors } from "../helpers/getAndUpsertKnownColors";
var async = require("async");

export function GetTaskData(tasknummer:number) {

  return new Promise(function (resolve, reject) {
    const transport = axios.create({
      withCredentials: true,
    });

    transport.get<any>(process.env.API_URL + `tasks/type/${tasknummer}/open`, { withCredentials: true, headers: { Cookie: GlobalVariable.cookie, 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(async res => {
      //console.log(res.data);
      if (res.data.code == 200) {
        if(tasknummer == 1) {
          GlobalVariable.currentSetData = res.data.result;
          DownloadSetDataMain(res.data.result).then(data => {
            resolve(data);
          });
        }
        else if(tasknummer == 4) {
          DownloadKnownColors(res.data.result).then(data => {
            resolve(data);
          });
        }
      }
      else {
        reject(false);
      }
    });
  });
}

export function DownloadSetDataMain(data: any) {
  return new Promise(function (resolve, reject) {
    async.eachLimit(data, GlobalVariable.setDownloadLimit, RequestSetdata, function (err: any) {
      resolve(true);
    });
  });
}

export function DownloadKnownColors(data: any) {
  return new Promise(function (resolve, reject) {
    async.eachLimit(data, GlobalVariable.setDownloadLimit, RequestKnownColors, function (err: any) {
      resolve(true);
    });
  });
}


export function RequestSetdata(entry: any, callback: any) {
  var req_information = JSON.parse(entry.information);
  var req_origin = JSON.parse(entry.origin);

  if (req_information.setno) {
    UpdateTaskStatus(entry.id, 2, entry.information);
    InsertProgressDetail(entry.id, 2, "Download Started", entry.information);
    GetAndUpsertSetDataByNo(req_information.setno, GlobalVariable.userId, entry.id, entry.information).then(function (data) {
      InsertProgressDetail(entry.id, 100, "Download Completed", entry.information);
      AddSetToCallingInstance(req_origin, req_information);
      UpdateTaskStatus(entry.id, 3, entry.information);
      callback();
    }, function (reason) {
      console.log("error:",reason)
      UpdateTaskStatus(entry.id, 4, entry.information);
      callback();
    });
  }
  else {
    UpdateTaskStatus(entry.id, 4, entry.information);
    callback();
  }
};

export function RequestKnownColors(entry: any, callback: any) {
  var req_information = JSON.parse(entry.information);
  var req_origin = JSON.parse(entry.origin);

  if (req_information.partno) {
    UpdateTaskStatus(entry.id, 2, entry.information);
    InsertProgressDetail(entry.id, 2, "Download Started", entry.information);
    GetAndUpsertKnownColors(req_information.partno, GlobalVariable.userId, entry.id, entry.information).then(function (data) {
      InsertProgressDetail(entry.id, 100, "Download Completed", entry.information);
      UpdateTaskStatus(entry.id, 3, entry.information);
      callback();
    }, function (reason) {
      console.log("error:",reason)
      UpdateTaskStatus(entry.id, 4, entry.information);
      callback();
    });
  }
  else {
    UpdateTaskStatus(entry.id, 4, entry.information);
    callback();
  }

}

export function ReInitAfterError() {
  if (GlobalVariable.currentSetData) {
    console.log("Making all download set to open " + GlobalVariable.currentSetData.length);
    GlobalVariable.currentSetData.forEach(function (element: any) {
      UpdateTaskStatus(element.id, 1, element.information);
    });
  }
}

function AddSetToCallingInstance(req_origin: any, req_information: any) {
  if(req_origin && req_origin.collection_id > 0){
    console.log("Adding Set to collection_id: " + req_origin.collection_id)
    addNewSetForEntity(JSON.stringify(req_information), 'expectedsets');
  } else if(req_origin && req_origin.offer_id > 0){
    console.log("Adding Set to offer_id" + req_origin.offer_id)
    addNewSetForEntity(JSON.stringify(req_information), 'offers_possiblesets');
  } else {
    console.log("Error: Unable to parse origin of Set!")
  }
}

export function addNewSetForEntity(req_information: any, endpoint:string) {
  const url = process.env.API_URL + endpoint;
  axios.post<any>(url, req_information, 
  { withCredentials: true, headers: { Cookie: GlobalVariable.cookie, 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" } }).then(data => {
      console.log(data.data);
      if (data.data.code != 200) {
        console.log(data.data.message);
      }
  });
}