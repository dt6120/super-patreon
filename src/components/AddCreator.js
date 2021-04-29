import React, { Component } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import TxStatus from './helper/TxStatus';
import getContract from '../ethereum/getContract';
import ipfs from '../ethereum/getipfs';

class AddCreatorForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allowed: null,
      account: null,
      name: null,
      fee: null,
      photoBuffer: null,
      photoHash: null,
      txStatus: null,
      txHash: null,
      txError: null,
      redirect: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleAddCreator = this.handleAddCreator.bind(this);
  }
  
  async componentDidMount() {
    const account = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
    this.setState({ account });

    const contract = await getContract();
    const allowed = await contract.methods.isCreator(this.state.account).call();
    this.setState({ allowed: !allowed });
  }

  handleChange(event) {
    switch (event.target.name) {
      case 'name':
        this.setState({ name: event.target.value });
        break;
      case 'fee':
        this.setState({ fee: event.target.value });
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

  async handleAddCreator(event) {
    if (this.state.name && this.state.fee && this.state.photoBuffer) {
      event.preventDefault();

      try {
        this.setState({ txStatus: 'pending' });
        const ipfsHash = await ipfs.add(this.state.photoBuffer);
        this.setState({ photoHash: ipfsHash.path });
        const contract = await getContract();
        const result = await contract.methods.addCreator(this.state.name, this.state.photoHash, this.state.fee).send({ from: this.state.account });
        console.log("Creator added");
        this.setState({ txStatus: 'success', txHash: result.transactionHash });
        this.setState({ redirect: true })
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
            <h3>Add creator</h3>
            <hr />
            <Form onSubmit={this.handleAddCreator}>
                <Form.Group controlId="creatorName" as={Row}>
                    <Form.Label column sm={3}>Name:</Form.Label>
                    <Col sm={5}>
                        <Form.Control
                            type="text"
                            name="name"
                            value={this.state.name}
                            placeholder="Enter name"
                            onChange={this.handleChange} 
                        />
                        <Form.Text className="text-muted">
                            Enter your full name. Users will identify you with this.
                        </Form.Text>
                    </Col>
                </Form.Group>
        
                <Form.Group controlId="creatorFee" as={Row}>
                    <Form.Label column sm={3}>Subscription Fee:</Form.Label>
                    <Col sm={5}>
                        <Form.Control
                            type="number"
                            name="fee"
                            value={this.state.fee}
                            placeholder="Enter fee"
                            onChange={this.handleChange}
                        />
                        <Form.Text className="text-muted">
                            Enter your subscription fee that the users have to pay.
                        </Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                        Upload profile photo:
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
                </Form.Group>

                <hr />

                {button}
            </Form>
            <hr />
            {/* <TxStatus txStatus={this.state.txStatus} txHash={this.state.txHash} txError={this.state.txError} /> */}
        </Container>
      );
    } else {
      form = (<h5 className="container mt-5">You are already a creator.</h5>);
    }

    return (
        <>
          {form}
          {this.state.redirect ? <Redirect to={'/dashboard/' + this.state.account} /> : null}
        </>
    );
  }
}

export default AddCreatorForm;
