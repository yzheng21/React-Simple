import Component from '../react/component';

const ReactDOM = {
    render
}

function render(vnode, container) {
    // console.log(vnode);
    return container.appendChild(_render(vnode));
}

function _render(vnode) {
    const {tag, attrs, children} = vnode;
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return;
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
    children.forEach(child => render(child, dom));
    return dom;
}

function createComponent(comp, props) {
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

function setComponentProps(comp, props) {
    comp.props = props;
    renderComponent(comp);
}

function renderComponent(comp) {
    let base;
    const renderer = comp.render();
    base = _render(renderer);
    comp.base = base;
}

function setAttribute(dom, key, value) {
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

export default ReactDOM;
