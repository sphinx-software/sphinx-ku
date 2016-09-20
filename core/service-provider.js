'use strict';

/**
 * @class ServiceProvider
 * @property {Container} container
 */
class ServiceProvider {
    constructor(container) {
        this.container = container;
    }

    register() { }

    *boot() { }
}

module.exports = ServiceProvider;
