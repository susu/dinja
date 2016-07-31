import dependencies from './dependencies';
import getFactory, {resetFactory} from './factory';
import service from './service';
import {enableDebug, disableDebug} from './debug';

module.exports = {
    dependencies,
    getFactory,
    service,
    resetFactory,
    enableDebug,
    disableDebug,
};
