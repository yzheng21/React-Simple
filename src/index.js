import React from './react';
import ReactDOM from './react-dom';

const ele = (
    <div className="active" title="123">
        Hello, <span>React</span>
    </div>
)

// function Home() {
//     return (
//         <div className="active" title="123">
//             Hello, <span>React</span>
//         </div>
//     )
// }

class Home extends React.Component {
    render() {
        return (
            <div className="active" title="123">
                Hello, <span>React</span>
            </div>
        );
    }
}

ReactDOM.render(<Home name="home" />, document.querySelector('#root'));

/*

createElement(tag, attrs, ...children)

var ele = React.creactElement("div", {
    className: "active",
    title: "123"
}, "Hello,", React.createElement("span", null, "React"))

*/