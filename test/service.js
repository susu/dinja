
import {service, getFactory, dependencies} from '../src/index';
import {expect} from 'chai';

describe('service', () => {

    it('can be used without decorator syntax', () => {
        class FooService {
            getFoo() { return 'foo'; }
        }

        service('FooService')(FooService);

        const fooInstance = getFactory().getService('FooService');
        expect(fooInstance.getFoo()).to.equal('foo');
    });

    it('can inject service into other service', () => {

        @service(['FooService'])
        class FooService {
            getFoo() { return 'foo'; }
        }

        @service(['BarService'])
        @dependencies(['FooService'])
        class BarService {
            constructor(fooService) { this._foo = fooService; }
            getBar() { return this._foo.getFoo() + 'bar'; }
        }

        const barInstance = getFactory().getService('BarService');
        expect(barInstance.getBar()).to.equal('foobar');
    });

    it('can be instantiated in a custom way', () => {

        const serviceProvider = () => new FooService('foo', 'bar');

        @service(['FooService'], serviceProvider)
        class FooService {
            constructor(custom, parameters) {
                expect(custom).to.equal('foo');
                expect(parameters).to.equal('bar');
            }
        }

        getFactory().getService('FooService');
    });

    it('allow custom provider when dependencies defined', () => {
        // This is a hell of a dependency stuff:
        // BarService has dependency FooService, but constructor needs other arguments.

        @service(['FooService'])
        class FooService {
            getFoo() { return 'foo'; }
        }

        // provider got dependencies in args
        const serviceProvider = (fooService) => new BarService(fooService, 'baz');

        @service(['BarService'], serviceProvider)
        @dependencies(['FooService'])
        class BarService {
            constructor(fooService, neededParam) {
                this._fooService = fooService;
                this._neededParam = neededParam;
            }

            getBar() {
                return this._fooService.getFoo() + 'bar' + this._neededParam;
            }
        }

        const barInstance = getFactory().getService('BarService');
        expect(barInstance.getBar()).to.equal('foobarbaz');
    });
});
