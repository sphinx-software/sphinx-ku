'use strict';

require('co-mocha');

const chai   = require('chai');
const assert = chai.assert;

const Container = require('./../index');

describe('Container tests', () => {

    it ('Container#instance() always the same instance', function* () {
        let instance1 = Container.instance();
        let instance2 = Container.instance();


        assert.strictEqual(instance1, instance2);
    });

    it ('Container#constructor() always return a new instance', function* () {
        let instance1 = new Container();
        let instance2 = new Container();

        assert.instanceOf(instance1, Container);
        assert.instanceOf(instance2, Container);
        assert.notEqual(instance1, instance2);
    });

    it ('Container#make can resolve a dependency as generator', function* () {
        let c = new Container();

        c.bind('Foo', function* () {
            return 'Bar';
        });

        let foo = yield c.make('Foo');

        assert.equal(foo, 'Bar');
    });

    it ('Container#make throws error when the dependency cannot be resolved', function* () {
        let c = new Container();
        try {
            yield c.make('notExisted');
        } catch (error) {
            assert.instanceOf(error, Error);
            assert.equal(error.toString(), 'Error: Could not resolve dependency [notExisted]');
        }
    });

    it ('Container#make returns new instance each time called', function* () {
        let c = new Container();

        c.bind('Foo', function* () {
            return {foo: 'bar'}
        });

        let fooInstance1 = yield c.make('Foo');
        let fooInstance2 = yield c.make('Foo');

        assert.notStrictEqual(fooInstance1, fooInstance2);
    });

    it ('Container#make can resolve dependency deeply', function* () {
        let c = new Container();

        c.bind('Foo', function* () {
            return 'FooService';
        });

        c.bind('Bar', function* (c) {
            return {
                foo: yield c.make('Foo')
            }
        });

        let bar = yield c.make('Bar');

        assert.deepEqual(bar, {
            foo: 'FooService'
        })
    });

    it ('Container#singleton resolve one instance only', function* () {
        let c = new Container();

        c.singleton('Foo', function* () {
            return {foo: 'bar'}
        });

        let fooInstance1 = yield c.make('Foo');
        let fooInstance2 = yield c.make('Foo');

        assert.strictEqual(fooInstance1, fooInstance2);
    });
});
