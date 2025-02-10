import BaseModel from "./BaseModel.js";
import Account from "./Account.js";
import Dossier from "./Dossier.js";
import * as ModelErrors from "./ModelErrors.js";

export default class DossierNote extends BaseModel {
    constructor(
        id,
        dossier,
        text,
        editor,
        publishDate
    ) {
        super();

        this._id = id;
        this._dossier = dossier;
        this._text = text;
        this._editor = editor;
        this._publishDate = publishDate;
    }

    static async getDossierNote(id) {
        const query = "SELECT * FROM dossier_note WHERE id=?";
        const params = [id];
        const [data] = await BaseModel._pool.query(query, params);

        if (data === 0) {
            throw new ModelErrors.RecordIsNotExists(`The dossier note with id "${id}" doesn't exist.`);
        }

        const record = data[0];
        const dossier = await Dossier.getDossier(record["dossier"]);
        const editor = await Account.getAccount(record["editor"]);

        return new DossierNote(
            record["id"],
            dossier,
            record["text"],
            editor,
            record["publish_date"]
        );
    }

    getId() { return this._id; }
    getText() { return this._text; }
    getEditor() { return this._editor; }
    getPublishDate() { return this._publishDate; }
}