'use strict';

/**
 *
 * @constructor
 */
const Container = function () {};


/**
 *
 * @type {{FACTORY: string, SINGLETON: string}}
 */
const bindingType = {
    FACTORY: 'factory',
    SINGLETON: 'singleton'
};

/**
 *
 * @type {{}}
 */
Container.prototype.bindings    = {};

/**
 *
 * @type {{}}
 */
Container.prototype.resolved    = {};

/**
 *
 * @param dependency
 * @param factory
 */
Container.prototype.bind = function (dependency, factory) {
    this.bindings[dependency] = {
        factory: factory,
        type: bindingType.FACTORY
    }
};

/**
 *
 * @param dependency
 * @param factory
 */
Container.prototype.singleton = function (dependency, factory) {
    this.bindings[dependency] = {
        factory: factory,
        type: bindingType.SINGLETON
    };
};

/**
 *
 * @param dependency
 * @returns {*}
 */
Container.prototype.make = function* (dependency) {

    if (!this.bindings[dependency]) {
        throw new Error(`Could not resolve dependency [${dependency}]`)
    }


    if (this.resolved[dependency]) {
        return this.resolved[dependency];
    }


    let bindings = this.bindings[dependency];
    let resolved = yield bindings.factory(this);


    if (bindingType.SINGLETON == bindings.type) {
        this.resolved[dependency] = resolved;
    }

    return resolved;
};

/**
 *
 * @type {Container}
 */
let instance = null;

/**
 *
 * @returns {Container}
 */
Container.instance = function () {
    if (!instance) {
        instance = new Container();
    }

    return instance;
};

/**
 * 
 * @type {Container}
 */
module.exports = Container;