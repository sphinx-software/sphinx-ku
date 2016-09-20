'use strict';

const lodash = require('lodash');

class RouteDecorator {

    constructor(routeHandleResolver) {
        this.resolver = routeHandleResolver;
    }

    *decorate(routesConfig, router) {
        let routeNames = lodash.keys(routesConfig);

        for (let index = 0; index < routeNames.length; index++) {
            let routeName   = routeNames[index];
            let routeConfig = routesConfig[routeName];
            let method      = (routeConfig.method || 'get').toLowerCase();
            let handlerDef  = routeConfig.handler;
            let handlers    = yield this.resolver.resolve(handlerDef);

            router[method].apply(router, [routeName, routeConfig.url].concat(handlers))
        }
    }
}

module.exports = RouteDecorator;