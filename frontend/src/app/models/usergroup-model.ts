export class UsergroupModel {
    public id: number;
    public groupname: string;


    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.groupname = data.groupname;
        }
    }
}