
import {dependencies, service} from '../src/index';
import {expect} from 'chai';

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';

describe('dependencies decorator for React components', () => {

    it('can inject a service into a React component', () => {
        @service('ExampleService')
        class ExampleService {
            getText() { return 'servicetext'; }
        }

        @dependencies(['ExampleService'])
        class Example extends React.Component {
            render() {
                return React.DOM.span(null,
                    this.props.exampleService.getText()
                );
            }
        }

        expect(getTextOfComponent(Example)).to.equal('servicetext');
    });

    it('allow services to be overriden from props', () => {
        @service('FooService')
        class FooService {
            getText() { return 'footext'; }
        }

        class FakeFooService {
            getText() { return 'fakefootext'; }
        }

        @dependencies(['FooService'])
        class Example extends React.Component {
            render() {
                return React.DOM.span(null,
                    this.props.fooService.getText()
                );
            }
        }

        expect(getTextOfComponent(Example, {fooService: new FakeFooService()})).to.equal('fakefootext');
    });

    it('does not harm other props', () => {
        @service('ExampleService')
        class ExampleService {
            getText() { return 'servicetext'; }
        }

        @dependencies(['ExampleService'])
        class Example extends React.Component {
            render() {
                return React.DOM.span(null,
                    this.props.exampleService.getText() + this.props.otherProp
                );
            }
        }

        expect(getTextOfComponent(Example, {otherProp: ' other'})).to.equal('servicetext other');
    });

    it('does not instantiate service if defined in props (useful when faking services)', () => {
        @service('ProductionService')
        class ProductionService {
            constructor() {
                expect('it should not be called').to.be.false;
            }
        }

        @dependencies(['ProductionService'])
        class Example extends React.Component {
            render() {
                return React.DOM.span(null,
                    this.props.productionService.getText()
                );
            }
        }

        class FakeProductionService {
            getText() { return 'fakeprodtext'; }
        }

        expect(getTextOfComponent(Example, {productionService: new FakeProductionService()}))
            .to.equal('fakeprodtext');
    });


    function getTextOfComponent(component, props = {}) {
        const element = ReactTestUtils.renderIntoDocument(React.createElement(component, props));
        const spanElement = ReactTestUtils.findRenderedDOMComponentWithTag(element, 'span');
        const spanDom = ReactDOM.findDOMNode(spanElement);
        return spanDom.textContent;
    }
});
