
import React from 'react';
import getFactory from './factory';
import {log} from './debug';

const DEPENDENCY_LIST_ATTR = '__dinjaDeps__';

export default function dependencies(dependencyList) {
    log(`Dependencies deco: ${dependencyList}`);
    return (target) => {
        log(`Injecting "${target.name}" with: ${dependencyList}`);
        target[DEPENDENCY_LIST_ATTR] = dependencyList;

        if (isReactComponentClass(target))
            return createWrapperComponent(target);

        return target;
    }
}

export function getDependencyList(target) {
    if (!(DEPENDENCY_LIST_ATTR in target))
        return [];
    return target[DEPENDENCY_LIST_ATTR];
}

function createWrapperComponent(target) {
    // need to use HOC (Higher Order Component) for injection
    return class extends React.Component {
        render() {
            log('HOC! ', target);
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
