import BaseModel from "./BaseModel.js";
import * as ModelErrors from "./ModelErrors.js";

export default class Account extends BaseModel {
    constructor(
        id,
        username,
        password,
        isWithdrawn,
        publishDate
    ) {
        super();

        this._id = id;
        this._username = username;
        this._password = password;
        this._isWithdrawn = isWithdrawn;
        this._publishDate = publishDate;
    }

    static async getAccount(id) {
        const query = "SELECT * FROM account WHERE id=?";
        const params = [id];
        const [data] = await BaseModel._pool.query(query, params);

        if (data.length === 0) {
            throw new ModelErrors.RecordIsNotExists(`The account with id "${id}" doesn't exist.`);
        }

        const record = data[0];

        return new Account(
            record["id"],
            record["username"],
            record["password"],
            record["isWithdrawn"],
            record["publish_date"]
        );
    }

    getId() { return this._id; }
    getUsername() { return this._username; }
    isWithdrawn() { return Boolean(this._isWithdrawn); }
    getPublishDate() { return this._publishDate; }
}