'use strict';

const co = require('co');
const Container = require('sphinx-container');

class Bootstrapper {

    static bootstrap(config) {

        return co(function* () {
            let container = new Container();

            container.singleton('config', function* () {
                return config;
            });

            let services  = config.services.map(ServiceProvider => {
                let serviceInstance = new ServiceProvider(container);

                serviceInstance.register();

                return serviceInstance;
            });

            for (let index = 0; index < services.length; index++) {
                yield services[index].boot();
            }

            return container;
        });
    }
}

module.exports = Bootstrapper;