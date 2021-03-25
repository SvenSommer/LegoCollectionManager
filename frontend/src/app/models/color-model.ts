export class ColorModel {
    public id: number;
    public color_id: number;
    public color_name : string;
    public color_code : string;
    public color_type : string;
    public parts_count : string;
    public year_from : string;
    public year_to : string;
    public created : string;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.color_id = data.color_id;
            this.color_name = data.color_name;
            this.color_code = data.color_code;
            this.color_type = data.color_type;
            this.parts_count = data.parts_count;
            this.year_from = data.year_from;
            this.year_to = data.year_to;
            this.created = data.created;
        }
    }
}