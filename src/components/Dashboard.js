import React, { Component } from 'react';
import CreatorCard from './cards/CreatorCard';
import PostList from './ListPosts';
import { Jumbotron, Container } from 'react-bootstrap';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
        account: null
    };
  }

    async componentDidMount() {
        const { match: { params } } = this.props;
        this.setState({ account: params.account });
    }

    render() {
      return (
        <div>
          <Jumbotron fliud>
            <Container>
              <h1>Creator Dashboard</h1>
              <h5 className="text-muted">( {this.state.account} )</h5>
            </Container>
          </Jumbotron>
          <div className="container">
            <CreatorCard account={this.state.account} />
            <PostList account={this.state.account} />
          </div>
        </div>
      );
    }
}

export default Dashboard;
