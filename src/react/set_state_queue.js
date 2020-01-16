/*
import { renderComponent } from '../react-dom/index';

1. async update state, merge multiple setState into queue
2. clean up the queue after a while, and render component

*/
import { renderComponent } from '../react-dom';
const setStateQueue = [];
const renderQueue = [];

function defer(fn) {
    return Promise.resolve().then(fn);
}

export function enqueueSetState(stateChange, component) {
    if (setStateQueue.length === 0) {
        defer(flush);
    }
    // merge
    setStateQueue.push({
        stateChange,
        component
    });
    let r = renderQueue.some(item => item === component);
    if (!r) {
        // first add
        renderQueue.push(component);
    }
}

// after a little whilte
function flush() {
    let item, component;
    while (item = setStateQueue.shift()) {
        const { stateChange, component } = item;

        // save prev state
        if (!component.prevState) {
            component.prevState = Object.assign({}, component.state);
        }
        if (typeof stateChange === 'function') {
            // callback function
            Object.assign(component.state, stateChange(component.prevState, component.props));

        } else {
            Object.assign(component.state, stateChange);
        }
        component.prevState = component.state;
    }

    while (component = renderQueue.shift()) {
        renderComponent(component);
    }
}
