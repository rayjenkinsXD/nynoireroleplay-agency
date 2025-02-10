import { createPool } from "mysql2";

export default class BaseModel {
    static _pool = createPool(BaseModel._getConnectionData()).promise();

    /*
        Этот метод будет брать все необходимые данные
        подключения. Часть из конфигурационных файлов,
        часть  из  переменных  окружения,  которые  в
        дальнейшем  перенесутся  в  Docker  контейнер
    */
    static _getConnectionData() {
        return {
            host: "localhost",
            user: "agent",
            password: "temporarypwd",
            database: "agency",
            connectionLimit: 10
        };
    }

    static closeAllConnections() {
        BaseModel._pool.end();
    }
}