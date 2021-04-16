export class UserCategoryModel {
    public id: number;
    public category_id: number;

    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.category_id = data.category_id;
        }
    }
}