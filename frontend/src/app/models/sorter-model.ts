export class SorterModel {
    public id: string;
    public name: string;
    public lifter_status_url: string;
    public lifter_update_url: string;
    public lifter_alterspeed_url: string;
    public vfeeder_status_url: string;
    public vfeeder_update_url: string;
    public vfeeder_alterspeed_url: string;
    public conveyor_status_url: string;
    public conveyor_update_url: string;
    public conveyor_alterspeed_url: string;
    public status: any;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.lifter_status_url = data.lifter_status_url;
            this.lifter_update_url = data.lifter_update_url;
            this.lifter_alterspeed_url = data.lifter_alterspeed_url;
            this.vfeeder_status_url = data.vfeeder_status_url;
            this.vfeeder_update_url = data.vfeeder_update_url;
            this.vfeeder_alterspeed_url = data.vfeeder_alterspeed_url;
            this.conveyor_status_url = data.conveyor_status_url;
            this.conveyor_update_url = data.conveyor_update_url;
            this.conveyor_alterspeed_url = data.conveyor_alterspeed_url;
            this.status = data.status;
        }
    }
}