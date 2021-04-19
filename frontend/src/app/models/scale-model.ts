export class ScaleModel {
    public id: number;
    public sorterid: number;
    public number : number;
    public name : string;
    public ip : string;
    public statusurl : string;
    public initializeurl : string;
    public reseturl : string;
    public tareurl : string;
    public expectBrickurl : string;
    public status : any;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.sorterid = data.sorterid;
            this.number = data.number;
            this.name = data.name;
            this.ip = data.ip;
            this.statusurl = data.statusurl;
            this.initializeurl = data.initializeurl;
            this.reseturl = data.reseturl;
            this.tareurl = data.tareurl;
            this.expectBrickurl = data.expectBrickurl;
            this.status = data.status;
        }
    }
}