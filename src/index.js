import React from './react';
import ReactDOM from './react-dom';

const ele = (
    <div className="active" title="123">
        Hello, <span>React</span>
    </div>
)

ReactDOM.render(ele, document.querySelector('#root'));

/*

createElement(tag, attrs, ...children)

var ele = React.creactElement("div", {
    className: "active",
    title: "123"
}, "Hello,", React.createElement("span", null, "React"))

*/