
const DEPENDENCY_LIST_ATTR = '__dinjaDeps__';

export default function dependencies(dependencyList) {
    return (target, property, descriptor) => {
        console.log(`Injecting "${target.name}" with: ${dependencyList}`);
        target[DEPENDENCY_LIST_ATTR] = dependencyList;
    }
}

export function getDependencyList(target) {
    return target[DEPENDENCY_LIST_ATTR];
}
