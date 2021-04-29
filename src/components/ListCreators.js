import React, { Component } from 'react';
import getContract from '../ethereum/getContract';
import CreatorCard from './cards/CreatorCard';
import { Jumbotron, Container, Button } from 'react-bootstrap';

class CreatorsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      count: 0,
      cards: null
    };
  }

    async componentDidMount() {
      const contract = await getContract();
      const result = await contract.methods.getCreators().call();

      this.setState({
        list: result[0],
        count: result[1]
      });

      const creatorCards = this.state.list.map(address => {
        return (
          <>
            <CreatorCard account={address} key={address} />
            <Button variant="info" href={'/dashboard/' + address}>View</Button>
          </>
        );
      });

      this.setState({ cards: creatorCards });
    }

    render() {
      return (
        <div>
          <Jumbotron fliud>
            <Container>
              <h1>Creators List</h1>
            </Container>
          </Jumbotron>
          <div className="container">
            {this.state.cards}
          </div>
        </div>
      );
    }
}

export default CreatorsList;
