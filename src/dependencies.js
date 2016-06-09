
import React from 'react';
import getFactory from './factory';

const DEPENDENCY_LIST_ATTR = '__dinjaDeps__';

export default function dependencies(dependencyList) {
    return (target, property, descriptor) => {
        console.log(`Injecting "${target.name}" with: ${dependencyList}`);
        target[DEPENDENCY_LIST_ATTR] = dependencyList;

        if (isReactComponentClass(target))
            return createWrapperComponent(target);
    }
}

export function getDependencyList(target) {
    return target[DEPENDENCY_LIST_ATTR];
}

function createWrapperComponent(target) {
    // need to use HOC (Higher Order Component) for injection
    return class extends React.Component {
        render() {
            const mergedProps = Object.assign({},
                getDependenciesAsReactProps(getDependencyList(target), Object.keys(this.props)),
                this.props
            );
            return React.createElement(target, mergedProps);
        }
    }
}

function isReactComponentClass(object) {
    return React.Component.isPrototypeOf(object);
}

/**
 * Create "myService" from "MyService"
 */
function toReactPropName(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
}

function getDependenciesAsReactProps(dependencyList, overrides) {
    const props = {};
    for (const dependencyName of dependencyList) {
        const propName = toReactPropName(dependencyName);
        if (!overrides.includes(propName))
            props[propName] = getFactory().getService(dependencyName);
    }
    return props;
}
