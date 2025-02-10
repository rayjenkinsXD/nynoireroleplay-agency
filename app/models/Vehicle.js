import BaseModel from "./BaseModel.js";
import Account from "./Account.js";
import Dossier from "./Dossier.js";
import VehicleNote from "./VehicleNote.js";
import * as ModelErrors from "./ModelErrors.js";

export default class Vehicle extends BaseModel {
    constructor(
        id,
        owner,
        model,
        number,
        color,
        editor,
        publishDate
    ) {
        super();

        this._id = id;
        this._owner = owner;
        this._model = model;
        this._number = number;
        this._color = color;
        this._editor = editor;
        this._publishDate = publishDate;
    }

    static async getVehicle(id) {
        const query = "SELECT * FROM vehicle WHERE id=?";
        const params = [id];
        const [data] = await BaseModel._pool.query(query, params);

        if (data.length === 0) {
            throw new ModelErrors.RecordIsNotExists(`The vehicle with id "${id}" doesn't exist.`);
        }

        const record = data[0];
        let owner = null;
        const editor = await Account.getAccount(record["editor"]);
        
        if (record["owner"] != null) {
            owner = await Dossier.getDossier(record["owner"]);
        }

        return new Vehicle(
            record["id"],
            owner,
            record["model"],
            record["number"],
            record["color"],
            editor,
            record["publish_date"]
        );
    }

    static async getAllVehicles() {
        const query = "SELECT * FROM vehicle";
        const [data] = await BaseModel._pool.query(query);
        let result = [];

        for (let record of data) {
            const owner = null;
            const editor = await Account.getAccount(record["editor"]);
            
            if (record["owner"] != null) {
                owner = await Dossier.getDossier(record["owner"]);
            }

            result.push(new Vehicle(
                record["id"],
                owner,
                record["model"],
                record["number"],
                record["color"],
                editor,
                record["publish_date"]
            ));
        }

        return result;
    }

    async getAllNotes() {
        const query = "SELECT * FROM vehicle_note WHERE vehicle=?";
        const params = [this._id];
        let [data] = await BaseModel._pool.query(query, params);
        let result = [];
    
        for (let record of data) {
            let vehicleNoteEditor = await Account.getAccount(record["editor"]);
    
            result.push(new VehicleNote(
                record["id"],
                this,
                record["text"],
                vehicleNoteEditor,
                record["publish_date"]
            ));
        }
    
        return result;
    }

    getId() { return this._id; }
    getOwner() { return this._owner; }
    getModel() { return this._model; }
    getNumber() { return this._number; }
    getColor() { return this._color; }
    getEditor() { return this._editor; }
    getPublishDate() { return this._publishDate; }
}