
import {inject, service} from '../src/index';
import {expect} from 'chai';

describe("inject", () => {
    it("returns a service instance by name", () => {

        @service('FooService')
        class FooService {
            getText() { return 'foobartext-inject'; }
        }

        const serviceInstance = inject('FooService')
        expect(serviceInstance.getText()).to.equal('foobartext-inject')
    });
});
