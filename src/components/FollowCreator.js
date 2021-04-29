import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import getContract from '../ethereum/getContract';
// import sf from '../ethereum/getsf';

class FollowCreator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            isFollower: null,
            fee: null,
            redirect: null,
            currentUrl: null
        };

        this.followCreator = this.followCreator.bind(this);
        this.unfollowCreator = this.unfollowCreator.bind(this);
    }

    async componentDidMount() {
        const account = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
        this.setState({ account });

        const contract = await getContract();
        const isFollower = await contract.methods.isFollower(this.state.account, this.props.creator).call();
        this.setState({ isFollower });

        const fee = (await contract.methods.getCreatorByAddress(this.props.creator).call()).fee;
        this.setState({ fee });
    }

    async followCreator() {
        try {
            // this.setState({ txStatus: 'pending' });
            const contract = await getContract();
            // let result;
            // await sf.initialize();
            // const daix = sf.tokens.fDAIx;
            // let flowRate = Math.round(385802469135802 * this.state.fee / 1000).toString();
            // await sf.cfa.createFlow({
            //   superToken: daix.address,
            //   sender: this.state.account,
            //   receiver: this.props.creator,
            //   flowRate
            // });
            await contract.methods.followCreator(this.props.creator).send({ from: this.state.account });
            // this.setState({ txStatus: 'success', txHash: result.transactionHash });
            this.setState({ redirect: true });
          } catch (error) {
            // this.setState({ txStatus: 'error', txError: error.message });
            console.log(error.message);
          }
    }

    async unfollowCreator() {
        try {
        //   this.setState({ txStatus: 'pending' });
          const contract = await getContract();
        //   let result;
          // await sf.initialize();
          // const daix = sf.tokens.fDAIx;
          // await sf.cfa.deleteFlow({
          //   superToken: daix.address,
          //   sender: this.state.account,
          //   receiver: this.props.creator,
          //   by: this.state.account
          // });
          await contract.methods.unfollowCreator(this.props.creator).send({ from: this.state.account });
        //   this.setState({ txStatus: 'success', txHash: result.transactionHash });
        this.setState({ redirect: true });
        } catch (error) {
        //   this.setState({ txStatus: 'error', txError: error.message });
            console.log(error.message);
        }
      }

    render() {
        let button, redirect;
        if (!this.state.isFollower) {
            button = (<Badge pill className="btn ml-1" variant="success" onClick={this.followCreator}>Follow</Badge>);
        } else {
            button = (<Badge pill className="btn ml-1" variant="danger" onClick={this.unfollowCreator}>Unfollow</Badge>);
        }

        if (this.state.redirect) {
          redirect = <Redirect to={'/dashboard/' + this.props.creator} />
        } else {
          redirect = null;
        }

        return (
            <>
                {button}
                {redirect}
            </>
        );
    }
}

export default FollowCreator;
