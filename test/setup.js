var jsdom = require('jsdom');
import {resetFactory} from '../src/index';

beforeEach(() => resetFactory());

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
// global.window = document.parentWindow;
global.window = document.defaultView;
global.navigator = {userAgent: 'node.js'};
