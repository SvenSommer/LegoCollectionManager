export class MessageTextModel {
    public id: number;
    public message: string;
    public active: number;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.message = data.message;
            this.active = data.active;
        }
    }
}