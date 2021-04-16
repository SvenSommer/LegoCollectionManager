export class PusherModel {
    public id: number;
    public scaleid: number;
    public valveid: number;
    public number : number;
    public name : string;
    public distanceFromOrigin_mm : number;
    public pushurl : string;
    public status : any;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.scaleid = data.scaleid;
            this.valveid = data.valveid;
            this.number = data.number;
            this.name = data.name;
            this.distanceFromOrigin_mm = data.distanceFromOrigin_mm;
            this.pushurl = data.pushurl;
            this.status = data.status;
        }
    }
}