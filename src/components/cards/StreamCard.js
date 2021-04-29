import React, { Component } from 'react';
import {  } from 'react-bootstrap';

class StreamCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            from: null,
            to: null,
            amount: null,
            time: null
        };
    }
    
    componentDidMount() {
        const { from, to, amount, time } = this.props.stream;
        this.setState({
            from: from.substring(0, 20) + '...', 
            to: to.substring(0, 20) + '...',
            amount, 
            time: new Date(time * 1000).toLocaleTimeString("en-US").split('/') });
    }

    render() {
        return (
            <div className="container border mt-1">
                <div className="row">
                    <div className="col md-5">{this.state.from}</div>
                    <div className="col md-5">{this.state.to}</div>
                    <div className="col md-1">{this.state.amount}</div>
                    <div className="col md-1">{this.state.time}</div>
                </div>
            </div>
        );
    }
}

export default StreamCard;
