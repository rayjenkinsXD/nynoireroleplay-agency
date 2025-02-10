import BaseModel from "./BaseModel.js";
import DossierNote from "./DossierNote.js";
import Account from "./Account.js";
import Vehicle from "./Vehicle.js";
import * as ModelErrors from "./ModelErrors.js";

export default class Dossier extends BaseModel {
    constructor(
        id,
        name,
        surname,
        race,
        sex,
        passport,
        description,
        photo,
        editor,
        publish_date
    ) {
        super();
        this._id = id;
        this._name = name;
        this._surname = surname;
        this._race = race;
        this._sex = sex;
        this._passport = passport;
        this._description = description;
        this._photo = photo;
        this._editor = editor;
        this._publish_date = publish_date;
    }

    /*
        Здесь  использован паттерн ФАБРИЧНЫЙ МЕТОД, чтобы решить следующую проблему:
        для  инициализации  объекта  модели  необходимо  вызвать  асинхронный  метод
        подключения к базе данных, чтобы сохранить оптимизацию. Была отделена логика
        конструктора  (просто определение полей) и асинхронного создания экземпляра.
    */
    static async getDossier(id) {
        const query = "SELECT * FROM dossier WHERE id=?";
        const params = [id];
        const [data] = await BaseModel._pool.query(query, params);

        if (data.length === 0) {
            throw new ModelErrors.RecordIsNotExists(`The dossier with id "${id}" doesn't exist.`);
        }

        const record = data[0];
        const editor = await Account.getAccount(record["editor"]);

        return new Dossier(
            record["id"],
            record["name"],
            record["surname"],
            record["race"],
            record["sex"],
            record["passport"],
            record["description"],
            record["photo"],
            editor,
            record["publish_date"]
        );
    }

    static async getAllDossiers() {
        const query = "SELECT * FROM dossier";

        let [data] = await BaseModel._pool.query(query);
        let result = [];

        /*
            Было принято решение не использовать в цикле getDossier(id),
            чтобы  не  долбить  сервер MySQL кучей запросов ради одного
            вызова метода.
        */
        for (let record of data) {
            const editor = await Account.getAccount(record["editor"]);

            result.push(new Dossier(
                record["id"],
                record["name"],
                record["surname"],
                record["race"],
                record["sex"],
                record["passport"],
                record["description"],
                record["photo"],
                editor,
                record["publish_date"]
            ));
        }

        return result;
    }

    async getAllNotes() {
        const query = "SELECT * FROM dossier_note WHERE dossier=?";
        const params = [this._id];
        const [data] = await BaseModel._pool.query(query, params);

        let result = [];

        for (let record of data) {
            let dossierNoteEditor = await Account.getAccount(record["editor"]);

            result.push(new DossierNote(
                record["id"],
                this,
                record["text"],
                dossierNoteEditor,
                record["publish_date"]
            ));
        }

        return result;
    }

    async getPhoneNumbers() {
        const query = "SELECT * FROM dossier_phone_numbers WHERE dossier=?";
        const params = [this._id];
        const [data] = await BaseModel._pool.query(query, params);
        
        let result = [];

        for (let record of data) {
            result.push(record["phone"]);
        }

        return result;
    }

    async getVehicles() {
        const query = "SELECT * FROM vehicle WHERE owner=?";
        const params = [this._id];
        const [data] = await BaseModel._pool.query(query, params);

        let result = [];

        for (let record of data) {
            result.push(await Vehicle.getVehicle(record["id"]));
        }

        return result;
    }

    /*
        Было принято решение отказаться от использования get/set,
        т.к.  для метод setState() является асинхронным и к нему
        нельзя  применить  геттер или сеттер. Это необходимо для
        улучшения читаемости кода.
    */    
    getId() { return this._id; }
    getName() { return this._name; }
    getSurname() { return this._surname; }
    getFullname() { return `${this._name} ${this._surname}`; }
    getRace() { return this._race; }
    getPassport() { return this._passport; }
    getDescription() { return this._description; }
    getPhoto() { return this._photo; }
    getEditor() { return this._editor; }
    getPublishDate() { return this._publish_date; }
    isMale() {
        if (this._sex === 1) {
            return true;
        }
        else if (this._sex === 0) {
            return false;
        }
        else {
            return null;
        }
    }
}