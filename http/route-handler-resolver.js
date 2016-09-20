'use strict';

const lodash = require('lodash');

class RouteHandlerResolver {

    constructor(container) {
        this.container = container;
    }

    *resolve(definitionString) {
        let definitionSegments = definitionString.split('#');
        let controllerInstance = yield this.container.make(definitionSegments[0]);
        let actionName         = definitionSegments[1];
        let handleStack        = yield this.resolveMiddlewares(controllerInstance, actionName);

        handleStack.push(function* () {
            controllerInstance.context = this;
            yield controllerInstance[actionName].apply(controllerInstance, arguments);
        });

        return handleStack;
    }

    *resolveMiddlewares(controller, actionName) {
        if (!controller.middlewares) {
            return [];
        }

        if (!controller.middlewares[actionName]) {
            return [];
        }

        let middlewareAliases = controller.middlewares[actionName];
        let middlewares = [];

        if (!lodash.isArray(middlewareAliases)) {
            middlewareAliases = [middlewareAliases];
        }


        for (let index = 0; index < middlewareAliases.length; index++) {
            middlewares.push(yield this.resolveMiddleware(middlewareAliases[index]));
        }

        return middlewares;
    }

    *resolveMiddleware(middlewareAlias) {
        if (!lodash.isString(middlewareAlias)) {
            return yield this.shrinkwrapMiddleware(middlewareAlias);
        }

        let middleware = yield this.container.make(middlewareAlias);

        return yield this.shrinkwrapMiddleware(middleware)
    }

    *shrinkwrapMiddleware(middleware) {
        let kernel = yield this.container.make('http.kernel');

        if (middleware.hasOwnProperty('handle')) {
            return function* () {
                middleware.context = this;
                yield middleware.handle.apply(middleware, arguments)
            };
        }

        return middleware;
    }
}

module.exports = RouteHandlerResolver;