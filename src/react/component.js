import {renderComponent} from '../react-dom';

class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
    }

    setState(stateChange) {
        Object.assign(this.state, stateChange);
        // render comp
        renderComponent(this);
    }
}
export default Component;
