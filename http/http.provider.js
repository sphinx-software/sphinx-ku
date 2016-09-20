'use strict';

const koa    = require('koa');
const Router = require('koa-router');
const RouteDecorator  = require('./route-decorator');
const RouteResolver   = require('./route-handler-resolver');
const ServiceProvider = require('./../core').ServiceProvider;


/**
 * @class
 */
class HttpProvider extends ServiceProvider {

    register() {

        this.container.singleton('http.kernel', function* () {
            return koa();
        });

        this.container.singleton('http.router.resolver', function* (container) {
            return new RouteResolver(container);
        });

        this.container.singleton('http.router.decorator', function* (container) {
            let resolver = yield container.make('http.router.resolver');
            return new RouteDecorator(resolver);
        });

        this.container.singleton('http.router', function* () {
            return new Router();
        });
    }

    *boot() {

        let config = yield this.container.make('config');
        let kernel = yield this.container.make('http.kernel');
        let router = yield this.container.make('http.router');
        let resolver = yield this.container.make('http.router.resolver');
        let decorator = yield this.container.make('http.router.decorator');

        for (let index = 0; index < config.http.filters.length; index++) {
            kernel.use(yield resolver.resolveMiddleware(config.http.filters[index]));
        }

        yield decorator.decorate(config.http.routes, router);

        kernel.use(router.routes());
        kernel.use(router.allowedMethods());
    }
}

module.exports = HttpProvider;