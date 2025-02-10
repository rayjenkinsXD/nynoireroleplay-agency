import express from "express";
import * as path from "path";
import { createConnection } from "mysql2";
 
const STATIC_DIR_PATH = path.join(import.meta.dirname, "static");
const VIEWS_DIR_PATH = path.join(import.meta.dirname, "views");

const app = express();

const CONNECTION_DATA_OBJECT = {
    host: "localhost",
    user: "root",
    database: "agency",
    password: "MucentendlerSepultureSE820@"
};

app.use("/static", express.static(STATIC_DIR_PATH));

app.use("/api", express.json());

app.get(
    ["/", "/home"],
    function (request, response) {
        response.sendFile(path.join(VIEWS_DIR_PATH, "index.html"));
    }
);

app.get(
    "/observer",
    function (request, response) {
        response.sendFile(path.join(VIEWS_DIR_PATH, "observer.html"));
    }
);

app.get(
    "/dossier",
    function (request, response) {
        response.sendFile(path.join(VIEWS_DIR_PATH, "dossier.html"));
    }
);

app.get(
    "/editor",
    function (request, response) {
        response.sendFile(path.join(VIEWS_DIR_PATH, "editor.html"));
    }
);

// REST API endpoints.
app.use(
    "/api",
    function (request, response, next) {
        // --> Auth here <--
        response.header("Content-Type", "application/json");

        next();
    }
);

app.get(
    "/api/dossier/:dossierID",
    function (request, response) {
        let dossierID = request.params["dossierID"];

        if (String(parseInt(dossierID)).length == 4) {
            let connection = createConnection(CONNECTION_DATA_OBJECT).promise();
            connection.query("SELECT * FROM dossier WHERE id=?", [dossierID])
                .then(
                    function ([data]) {
                        if (data.length == 1) {
                            response.send(JSON.stringify(data[0]));
                        }
                        else {
                            response.send(JSON.stringify(null));
                        }
                    }
                );
        }
        else {
            response.sendStatus(400);
            return;
        }
    }
);

app.get(
    "/api/dossier/all",
    function (request, response) {
        let connection = createConnection(CONNECTION_DATA_OBJECT).promise();
        connection.query("SELECT * FROM dossier")
            .then(
                function([data]) {
                    response.send(JSON.stringify(data));
                }
            )
            .finally(() => connection.end());
    }
);

// TODO: Добавить фильтрацию по дате
app.get(
    "/api/dossier/filter",
    function (request, response) {
        // Проверка на наличие по крайней мере одного фильтра
        if (Object.keys(request.query).length == 0) {
            response.status(400).send({"Error": "The filter MUST HAVE at least one param."});

            return;
        }
        
        let query = "SELECT * FROM dossier WHERE ";
        let queryParams = [];

        /*
            Проверка на фильтры: можно указывать только разрешенные фильтры:
                (name, surname, race, ismale, passport)
            Проверка на значения: определенные значения должны соблюдать определенные условия,
                например, "ismale" преобразуется в "sex" и для этого "ismale" должен принимать
                определенные значения: true/false, 1/0
        */
        for (let [key, value] of Object.entries(request.query)) {
            key = key.toLowerCase();
            value = value.toLowerCase();

            switch (key) {
                case "name":
                    query += "name=? AND ";
                    queryParams.push(value);
                    break;
                    
                case "surname":
                    query += "surname=? AND ";
                    queryParams.push(value);
                    break;

                case "race":
                    query += "race=? AND ";
                    
                    if (["european", "asian", "negro"].includes(value)) {
                        queryParams.push(value);
                        break;
                    }
                    else {
                        response.status(400).send({"Error": "Incorrect race"});
                        
                        return;
                    }

                case "ismale":
                    query += "sex=? AND ";

                    if (value == "true" || value == "1") {
                        queryParams.push(true);
                        break;
                    }
                    else if (value == "false" || value == "0") {
                        queryParams.push(false);
                        break;
                    }
                    else {
                        response.status(400).send({"Error": `"ismale" param MUST BE string which corresponds boolean type (true/false)`});
                        
                        return;
                    }
                case "passport":
                    // TODO: нужно бы добавить проверку: паспорт не должен содержать символы
                    query += "passport=? AND ";
                    queryParams.push(value);
                    break;

                default:
                    response.status(400).send({"Error": `The param "${key}" doesn't exist`});
                    
                    return;
            }
        }

        query = query.slice(0, -5);

        let connection = createConnection(CONNECTION_DATA_OBJECT).promise();
        connection.query(query, queryParams)
            .then(([data]) => response.send(JSON.stringify(data)))
            .finally(() => connection.end());
    }
);

app.get(
    "/api/vehicle/all",
    function (request, response) {
        let connection = createConnection(CONNECTION_DATA_OBJECT).promise();
        connection.query("SELECT * FROM vehicle;")
            .then((([data]) => response.send(JSON.stringify(data))))
            .finally(() => connection.end());
    }
);

// TODO: Добавить фильтрацию по дате
app.get(
    "/api/vehicle/filter",
    function (request, response) {
        // Проверка на наличие по крайней мере одного фильтра
        if (Object.keys(request.query).length == 0) {
            response.status(400).send({"Error": "The filter MUST HAVE at least one param."});

            return;
        }
        
        let query = "SELECT * FROM vehicle WHERE ";
        let queryParams = [];

        /*
            Проверка на фильтры: можно указывать только разрешенные фильтры:
                (owner, model, number, color)
            Проверка на значения: определенные значения должны соблюдать определенные условия,
                например, существует ли такая модель автомобиля на сервере или нет.
        */
        for (let [key, value] of Object.entries(request.query)) {
            key = key.toLowerCase();
            value = value.toLowerCase();

            switch (key) {
                // TODO: 
                case "owner":
                    query += "owner=? AND ";
                    queryParams.push(value);
                    break;

                // TODO: Добавить проверку, существует ли такая модель автомобиля на сервере.
                case "model":
                    query += "model=? AND ";
                    queryParams.push(value);
                    break;

                case "number":
                    query += "number=? AND ";
                    queryParams.push(value);
                    break;

                case "color":
                    query += "color=? AND ";
                    queryParams.push(value);
                    break;

                default:
                    response.status(400).send({"Error": `The param "${key}" doesn't exist`});
                    
                    return;
            }
        }

        query = query.slice(0, -5);

        let connection = createConnection(CONNECTION_DATA_OBJECT).promise();
        connection.query(query, queryParams)
            .then(([data]) => response.send(JSON.stringify(data)))
            .finally(() => connection.end());
    }
);

app.post(
    "/api/vehicle",
    function (request, response) {
        let body = JSON.parse(request.body);

        // Проверка полей запроса
        if (body["owner"] !== null) {
            
        }

        let connection = createConnection(CONNECTION_DATA_OBJECT).promise();
        connection.query();

        response.sendStatus(200);
    }
);

app.listen(80);