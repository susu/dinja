
import {dependencies, getFactory, service} from '../src/index';
import {expect} from 'chai';

describe('getFactory', () => {
    it('returns something', () => {
        const factory = getFactory();
        expect(factory).to.not.be.undefined;
    });
});

describe('dependencies decorator for classes', () => {

    it('can inject a service into a class constructor', () => {

        @service('FooService')
        class FooService {
            getText() {
                return 'foobartext';
            }
        }

        @dependencies(['FooService'])
        class Bar {
            constructor(fooService) {
                this._fooService = fooService;
            }

            getText() {
                return this._fooService.getText();
            }
        }

        const barInstance = getFactory().create(Bar);
        expect(barInstance.getText()).to.equal('foobartext');
    });

    it('does not harm class constructor, so it can be instantiated without factory', () => {
        // TODO
    });
});
