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
    constructor(props) {
        super(props);
        this.state = {num: 0};
    }

    componentWillMount() {
        console.log('comp will mount');
    }

    componentWillReceiveProps() {
        console.log(props);
    }

    componentWillUpdate() {
        console.log('will update');
    }

    componentDidUpdate() {
        console.log('did update');
    }

    componentDidMount() {
        console.log('comp did mount');
        for (let i = 0; i < 10; i++) {
            this.setState((prevState, prevProps) => {
                console.log(prevState.num);
                return {
                    num: prevState.num + 1
                }
            });
        }
    }

    handleClick() {
        this.setState({
            num: this.state.num + 1
        });
    }

    render() {
        return (
            <div className="active" title="123">
                <div>Hello, <span>React {this.state.num}</span></div> 
                <button onClick={this.handleClick.bind(this)}>Add+1</button>
            </div>
        );
    }
}

ReactDOM.render(<Home title="home" />, document.querySelector('#root'));

/*

createElement(tag, attrs, ...children)

var ele = React.creactElement("div", {
    className: "active",
    title: "123"
}, "Hello,", React.createElement("span", null, "React"))

*/