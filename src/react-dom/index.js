import Component from '../react/component';
import { diff, diffNode } from './diff';

function render(vnode, container, dom) {
    return diff(dom, vnode, container);
}

function _render(vnode) {
    const {tag, attrs, children} = vnode;
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return;
    if (typeof vnode === 'number') vnode = String(vnode);
    
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode);
    }

    // if tag is function, render component
    if (typeof tag === 'function') {
        // 1. create componet
        const comp = createComponent(tag, attrs);
        // 2. set attrs
        setComponentProps(comp, attrs);
        // 3. render node
        return comp.base;
    }

    const dom = document.createElement(tag);
    if (attrs) {
        Object.keys(attrs).forEach(key => {
            const value = attrs[key];
            setAttribute(dom, key, value);
        });
    }
    // recursive render child node
    if (children) children.forEach(child => render(child, dom));
    return dom;
}

export function createComponent(comp, props) {
    let instance;
    if (comp.prototype && comp.prototype.render) {
        // if class based, create instance, return
        instance = new comp(props);
    } else {
        // if function based, extend function comp to class comp
        instance = new Component(props);
        instance.constructor = comp;
        instance.render = function() {
            return this.constructor()
        }
    }
    return instance;
}

export function setComponentProps(comp, props) {
    if (!comp.base) {
        if (comp.componentWillMount) comp.componentWillMount();
    } else if (comp.componentWillReceiveProps) {
        comp.componentWillReceiveProps();
    }
    comp.props = props;
    renderComponent(comp);
}

export function renderComponent(comp) {
    let base;
    const renderer = comp.render();
    base = diffNode(comp.base, renderer);
    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate();
    }
    if (comp.base) {
        if (comp.componentDidUpdate) comp.componentDidUpdate();
    } else if (comp.componentDidMount) {
        comp.componentDidMount();
    }

    // replace node
    // if (comp.base && comp.base.parentNode) {
    //     comp.base.parentNode.replaceChild(base, comp.base);
    // }
    comp.base = base;
}

export function setAttribute(dom, key, value) {
    if (key === 'className') {
        key = 'class';
    }
    if (/on\w+/.test(key)) {
        // Event
        key = key.toLowerCase();
        dom[key] = value || '';
    } else if (key === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        } else if (value && typeof value === 'object') {
            // {width: 20px}
            for (let k in value) {
                if (typeof value[k] === 'number') {
                    dom.style[k] = value[k] + 'px';
                } else {
                    dom.style[k] = value[k];
                }
            }
        }
    } else {
        if (key in dom) {
            dom[key] = value || '';
        }
        if (value) {
            dom.setAttribute(key, value);
        } else {
            dom.removeAttribute(key);
        }
    }
}

export default {
    render
};
