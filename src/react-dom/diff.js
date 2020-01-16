import { setAttribute, setComponentProps, createComponent } from './index';

export function diff(dom, vnode, container) {

    const ret = diffNode(dom, vnode);

    if (container) {
        container.appendChild(ret);
    }

    return ret;
}

export function diffNode(dom, vnode) {
    let out = dom;
    const {tag, attrs, children} = vnode;
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return;
    if (typeof vnode === 'number') vnode = String(vnode);
    
    if (typeof vnode === 'string') {
        if (dom && dom.nodeType === 3) {
            if (dom.textContent !== vnode) {
                // update text content
                dom.textContent = vnode;
            }
        } else {
            out = document.createTextNode(vnode);
            if (dom && dom.parentNode) {
                dom.parentNode.replaceNode(out, dom);
            }
        }
        return out;
    }

    if (typeof tag === 'function') {
        return diffComponent(out, vnode);
    }

    // non-text dom
    if (!dom) {
        out = document.createElement(tag);
    }

    if (children && children.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
        diffChildren(out, children);
    }
    diffAttribute(out, vnode);
    return out;
}

function diffComponent(dom, vnode) {
    // if no change in component, reset props
    let comp = dom;
    if (comp && comp.constructor === vnode.tag) {
        // reset props
        setComponentProps(comp, vnode.attrs);
        dom = comp.base;
    } else {
        // component changes
        if (comp) {
            unmountComponent(comp);
            comp = null;
        }
        // create new comp, and set attrs, mount base
        comp = createComponent(vnode.tag, vnode.attrs);
        setComponentProps(comp, vnode.attrs);
        dom = comp.base;
    }
    return dom;
}

function unmountComponent(comp) {
    removeNode(comp.base);
}

function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeNode(dom);
    }
}

function diffChildren(dom, vchildren) {
    const domChildren = dom.childNodes;
    const children = [];
    const keyed = {};

    //seperate the node with key and node without key
    if (domChildren.length > 0) {
        domChildren.forEach(domChild => {
            children.push(domChild);
        });
    }
    if (vchildren && vchildren.length > 0) {
        let min = 0;
        let childrenLen = children.length;
        [...vchildren].forEach((vchild, i) => {
            const key = vchild.key;
            let child;
            if (key) {
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            } else if (childrenLen > min) {
                // if not key, look for the node with same type firstly
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j];
                    if (c) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
            }
            // compare
            child = diffNode(child, vchild);

            // update dom
            const f = domChildren[i];

            if (child && child !== dom && child !== f) {
                // new node
                if (!f) {
                    dom.appendChild(child);
                } else if (child === f.nextSibling) {
                    removeNode(f);
                } else {
                    dom.insertBefore(child, f);
                }
            }
        })
    }
}

function diffAttribute(dom, vnode) {
    // dom is existing node
    const oldAttrs = {};
    const newAttrs = vnode.attrs;
    const domAttrs = dom.attributes;
    [...domAttrs].forEach(item => {
        oldAttrs[item.name] = item.value;
    });

    // compare
    for (let key in oldAttrs) {
        if (!(key in newAttrs)) {
            setAttribute(dom, key, undefined);
        }
    }

    // update
    for (let key in newAttrs) {
        if (oldAttrs[key] != newAttrs[key]) {
            setAttribute(dom, key, newAttrs[key]);
        }
    }
}
