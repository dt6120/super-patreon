import React, { Component } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import FollowCreator from '../FollowCreator';
import getContract from '../../ethereum/getContract';

class CreatorCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreator: null,
      name: null,
      profile: null,
      address: null,
      fee: null,
      postCount: null,
      followerCount: null,
      creatorSince: null
    };
  }

  async componentDidMount() {
    const contract = await getContract();
    const isCreator = await contract.methods.isCreator(this.props.account).call();
    this.setState({ isCreator });

    if (this.state.isCreator) {
      const creator = await contract.methods.getCreatorByAddress(this.props.account).call();

      this.setState({
        name: creator.name,
        profile: 'https://ipfs.io/ipfs/' + creator.photoHash,
        address: creator.addr,
        fee: creator.fee,
        postCount: creator.postCount,
        followerCount: creator.followerCount,
        creatorSince: new Date(creator.creatorSince * 1000).toLocaleTimeString("en-US").split('/')
      });
    }
  }

  render() {
    let card;
    
    if (this.state.isCreator) {
      card = (
        <Card className="text-center creatorCard">
          <Card.Header>
            <div className="row">
              <div className="col-md-4">
                <img src={this.state.profile} alt={this.state.name} className="rounded-circle" width="100" height="100" />
              </div>
              <div className="col-md-8">
                <h3>{this.state.name}</h3>
              </div>
            </div>
            <div className="row text-muted">
              {this.state.address}
            </div>
          </Card.Header>
          <Card.Body>
            <Card.Title>{this.state.name} <FollowCreator creator={this.props.account} /></Card.Title>
            <Card.Text>
              <ListGroup>
                <ListGroup.Item>Subscription Fee: {this.state.fee} tokens</ListGroup.Item>
                <ListGroup.Item>Post Count: {this.state.postCount}</ListGroup.Item>
                <ListGroup.Item>Follower Count: {this.state.followerCount}</ListGroup.Item>
                <ListGroup.Item>Creator Since: {this.state.creatorSince}</ListGroup.Item>
              </ListGroup>
            </Card.Text>
          </Card.Body>
          {/* <Card.Footer className="text-muted">
            <FollowCreator creator={this.props.account} />
          </Card.Footer> */}
        </Card>
      );
    } else {
      card = (<h5>Creator not found.</h5>);
    }

    return (
      <>{card}</>
    );
  }
}

export default CreatorCard;
