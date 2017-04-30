import dependencies from './dependencies';
import getFactory, {resetFactory, inject} from './factory';
import service from './service';
import {enableDebug, disableDebug} from './debug';

module.exports = {
    dependencies,
    getFactory,
    inject,
    service,
    resetFactory,
    enableDebug,
    disableDebug,
};
