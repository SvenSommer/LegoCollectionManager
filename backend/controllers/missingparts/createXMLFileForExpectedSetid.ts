import {Request, Response} from 'express';
import connection from "../../database_connection";

export default (req: Request, res: Response) => {
    const {expectedsetid: expectedsetid} = req.params;
    const showmissingparts = `SELECT * FROM LegoSorterDB.missing_parts_perSet
                                            WHERE expectedset_id =  ${expectedsetid} `
    connection.query(showmissingparts,(err, missing_parts:any) => {
        if (err) res.json({
            code: 500,
            message: 'Some error occurred while fetching missing parts by expectedset_id',
            errorMessage: process.env.DEBUG && err
        });
        else {
            var doc = document.implementation.createDocument("", "", null);
            var inventoryElem = doc.createElement("INVENTORY");
            for (var i = 0; i < missing_parts.length; i++) {
                var itemElem = doc.createElement("ITEM");
                var itemTypeElem = doc.createElement("ITEMTYPE");
                if(missing_parts[i].type == "PART")
                    itemTypeElem.innerHTML = "P"; 
                if (missing_parts[i].type == "MINIFIG")
                    itemTypeElem.innerHTML = "M";
                itemElem.appendChild(itemTypeElem);
                var itemIdElem = doc.createElement("ITEMID");
                itemIdElem.innerHTML = missing_parts[i].partno
                itemElem.appendChild(itemIdElem);
                var itemColorElem = doc.createElement("COLOR");
                itemColorElem.innerHTML = missing_parts[i].color_id
                itemElem.appendChild(itemColorElem);
                var itemMinQtyElem = doc.createElement("MINQTY");
                itemMinQtyElem.innerHTML = missing_parts[i].quantity
                itemElem.appendChild(itemMinQtyElem);
                inventoryElem.appendChild(itemElem);
            }

            res.json({
                code: 200,
                doc
            });
        }
    });
}
