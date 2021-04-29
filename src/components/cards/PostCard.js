import React, { Component } from 'react';
import { Card, Button, ListGroup, Badge } from 'react-bootstrap';
import getContract from '../../ethereum/getContract';

class PostCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allowed: null,
      title: null,
      creator: null,
      createdOn: null,
      tags: null
    };
  }

  async componentDidMount() {
    const contract = await getContract();

    try {
      const post = await contract.methods.viewPost(this.props.postId).call({ from: this.props.account });
      const tags = post.tags.split(',').map(tag => {
        return (<Badge pill className="mr-1" variant="success">{tag}</Badge>);
      });

      this.setState({
        allowed: true,
        title: post.title,
        creator: post.creator,
        createdOn: new Date(post.createdOn * 1000).toLocaleTimeString("en-US").split('/'),
        tags
      });
    } catch (error) {
      this.setState({ allowed: false });
    }
  }

  render() {
    let card;
    
    if (this.state.allowed) {
      card = (
        <Card className="text-center m-3" style={{ width: '30rem' }}>
          <Card.Header>Post title: {this.state.title}</Card.Header>
          <Card.Body>
            <Card.Title>Published: {this.state.createdOn}</Card.Title>
            <Card.Text>
              Tags: {this.state.tags}
            </Card.Text>
          </Card.Body>
          <Card.Footer className="text-muted">
            <Button variant="info" href={'/post/' + this.state.title}>View</Button>
          </Card.Footer>
        </Card>
      );
    } else {
      card = (<h5>Post not found.</h5>);
    }

    return (
      <>{card}</>
    );
  }
}

export default PostCard;
