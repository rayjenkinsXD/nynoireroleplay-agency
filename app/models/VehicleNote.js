import BaseModel from "./BaseModel.js";
import Account from "./Account.js";
import Vehicle from "./Vehicle.js";
import * as ModelErrors from "./ModelErrors.js";

export default class VehicleNote extends BaseModel {
    constructor(
        id,
        vehicle,
        text,
        editor,
        publishDate
    ) {
        super();

        this._id = id;
        this._vehicle = vehicle;
        this._text = text;
        this._editor = editor;
        this._publishDate = publishDate;
    }

    static async getDossierNote(id) {
        const query = "SELECT * FROM vehicle_note WHERE id=?";
        const params = [id];
        const [data] = await BaseModel._pool.query(query, params);
    
        if (data === 0) {
            throw new ModelErrors.RecordIsNotExists(`The vehicle note with id "${id}" doesn't exist.`);
        }
    
        const record = data[0];
        const vehicle = await Vehicle.getVehicle(record["vehicle"]);
        const editor = await Account.getAccount(record["editor"]);
    
        return new DossierNote(
            record["id"],
            vehicle,
            record["text"],
            editor,
            record["publish_date"]
        );
    }

    getId() { return this._id; }
    getVehicle() { return this._vehicle; }
    getText() { return this._text; }
    getEditor() { return this._editor; }
    getPublishDate() { return this._publishDate; }
}