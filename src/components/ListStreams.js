import React, { Component } from 'react';
import StreamCard from './cards/StreamCard';
import { Jumbotron, Container } from 'react-bootstrap';
import getContract from '../ethereum/getContract';

class StreamList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            streams: null
        };
    }

    async componentDidMount() {
        const { match: { params } } = this.props;

        const contract = await getContract();
        const logs = await contract.getPastEvents('StreamUpdate', {
            filter: { from: params.account },
            fromBlock: 0,
            toBlock: 'latest'
        });

        const streams = logs.reverse().map(log => {
            return <StreamCard stream={log.returnValues} />
        });
        this.setState({ streams });
    }

    render() {
        let streams;
        if (this.state.streams && this.state.streams.length > 0) {
            streams = (
                <>
                    <div className="row">
                        <div className="col md-4"><strong>FROM</strong></div>
                        <div className="col md-4"><strong>TO</strong></div>
                        <div className="col md-2"><strong>AMOUNT</strong></div>
                        <div className="col md-2"><strong>TIME</strong></div>
                    </div>
                    {this.state.streams}
                </>
            );
        } else {
            streams = <h5 className="mt-5">No streams yet.</h5>
        }
        return (
            <>
                <Jumbotron fliud>
                    <Container>
                    <h1>Stream History</h1>
                    </Container>
                </Jumbotron>
                <div className="container">
                    {streams}
                </div>
            </>
        );
    }
}

export default StreamList;
