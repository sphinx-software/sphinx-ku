'use strict';

const sql             = require('co-mssql');
const ServiceProvider = require('./../core').ServiceProvider;

class MssqlServiceProvider extends ServiceProvider {
    register() {
        this.container.singleton('mssql', function* (container) {
            let config      = yield container.make('config');
            let connection  = new sql.Connection(config.mssql);
            yield connection.connect();
            return connection;
        })
    }
}

module.exports = MssqlServiceProvider;