import React, { Component } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import TxStatus from './helper/TxStatus';
import getContract from '../ethereum/getContract';
import ipfs from '../ethereum/getipfs';

class AddPostForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allowed: null,
      account: null,
      title: null,
      tags: null,
      txStatus: null,
      txHash: null,
      txError: null,
      redirect: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleAddPost = this.handleAddPost.bind(this);
  }
  
  async componentDidMount() {
    const account = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
    this.setState({ account });

    const contract = await getContract();
    const allowed = await contract.methods.isCreator(this.state.account).call();
    this.setState({ allowed });
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'title':
        this.setState({ title: event.target.value });
        break;
      case 'tags':
        this.setState({ tags: event.target.value });
        break;
      default:
        break;
    }
  }

  handleFile(event) {
    event.preventDefault();
    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => this.convertToBuffer(reader);
  }

  async convertToBuffer(reader) {
    const buffer = await Buffer.from(reader.result);
    this.setState({ photoBuffer: buffer });
  }

  async handleAddPost(event) {
    if (this.state.title) {
      event.preventDefault();

      try {
        this.setState({ txStatus: 'pending' });
        // const ipfsHash = await ipfs.add(this.state.photoBuffer);
        // this.setState({ photoHash: ipfsHash[0].hash });
        const contract = await getContract();
        const result = await contract.methods.createPost('0x000', this.state.title, this.state.tags).send({ from: this.state.account });
        this.setState({ txStatus: 'success', txHash: result.transactionHash });

        this.setState({ redirect: true });
      } catch (error) {
        this.setState({ txStatus: 'error', txError: error.message });
      }
    }
  }

  render() {
      let form, button;

      if (this.state.txStatus === 'pending') {
        button = (
          <Button variant="warning">
            Processing
          </Button>
        );
      } else if (this.state.txStatus === 'error') {
        button = (
          <Button variant="danger" type="submit">
            Try again
          </Button>
        );
      } else {
        button = (
          <Button variant="primary" type="submit">
            Add
          </Button>
        );
      }

      if (this.state.allowed) {
          form = (
            <Container className="border mt-5 p-5">
                <h3>Add post</h3>
                <hr />
                <Form onSubmit={this.handleAddPost}>
                    <Form.Group controlId="postTitle" as={Row}>
                        <Form.Label column sm={3}>Title:</Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                type="text"
                                name="title"
                                value={this.state.title}
                                placeholder="Enter title"
                                onChange={this.handleChange} 
                            />
                            <Form.Text className="text-muted">
                                Enter post title.
                            </Form.Text>
                        </Col>
                    </Form.Group>
            
                    <Form.Group controlId="postTags" as={Row}>
                        <Form.Label column sm={3}>Tags:</Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                type="text"
                                name="tags"
                                value={this.state.tags}
                                placeholder="Enter tags"
                                onChange={this.handleChange} 
                            />
                            <Form.Text className="text-muted">
                                Enter relevant tags/keywords separated by commas.
                            </Form.Text>
                        </Col>
                    </Form.Group>

                    {/* <Form.Group as={Row}>
                        <Form.Label column sm={3}>
                            Upload post:
                        </Form.Label>
                        <Col sm={8}>
                            <Form.File
                                className="position-relative"
                                required
                                name="file"
                                onChange={this.handleFile}
                                feedbackTooltip
                            />
                        </Col>
                    </Form.Group> */}

                    <hr />

                    {button}
                </Form>
                <hr />
                {/* <TxStatus txStatus={this.state.txStatus} txHash={this.state.txHash} txError={this.state.txError} /> */}
            </Container>
          );
      } else {
          form = (<h5 className="container mt-5">You are not a creator.</h5>);
      }

    return (
        <>
            {form}
            {this.state.redirect ? <Redirect to={'/dashboard/' + this.state.account} /> : null}
        </>
    );
  }
}

export default AddPostForm;
