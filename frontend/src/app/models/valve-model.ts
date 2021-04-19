export class ValveModel {
    public id: string;
    public sorterid: number;
    public number : number;
    public name : string;
    public ip : string;
    public valvesCount : number;
    public statusurl : string;
    public pressureurl : string;
    public updateurl : string;
    public status : any;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.sorterid = data.sorterid;
            this.number = data.number;
            this.name = data.name;
            this.ip = data.ip;
            this.valvesCount = data.valvesCount;
            this.statusurl = data.statusurl;
            this.pressureurl = data.pressureurl;
            this.updateurl = data.updateurl;
            this.status = data.status;
        }
    }
}