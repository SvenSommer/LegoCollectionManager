export class OfferPropertiesModel {
    public offer_id: number;
    public weight_kg: number;
    public instructions: string;
    public minifigs: string;
    public boxes: string;
    public notes: string;
    public created: string;

    constructor(data = null) {
        
        if (data) {
            
            this.offer_id = data.offer_id;
            this.weight_kg = data.weight_kg;
            this.instructions = data.instructions;
            this.minifigs = data.minifigs;
            this.boxes = data.boxes;
            this.notes = data.notes;
        }
    }
}