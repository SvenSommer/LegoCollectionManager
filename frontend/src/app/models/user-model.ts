export class UserModel {
    public id: number;
    public username: string;
    public password: string;
    public full_name: string;
    public usergroup: number;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.username = data.username;
            this.password = data.password;
            this.full_name = data.full_name;
            this.usergroup = data.usergroup;
        }
    }
}