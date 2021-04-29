import React, { Component } from 'react';
import { Jumbotron, Container } from 'react-bootstrap';
import CreatorCard from './cards/CreatorCard';
import getContract from '../ethereum/getContract';

class Following extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            following: null
        };
    }

    async componentDidMount() {
        const { match: { params } } = this.props;
        this.setState({ account: params.account });

        const contract = await getContract();
        let creators = (await contract.methods.getCreators().call())[0];

        let isFollowing = [];
        for (let address of creators) {
            if (await contract.methods.isFollower(this.state.account, address).call()) isFollowing.push(address);
        }

        // creators = await creators.map(async (address) => {
        //     const isFollower = await contract.methods.isFollower(this.state.account, address).call();
        //     if (isFollower) return address;
        // });
        // console.log(await creators);
            // .filter(async (address) => {
            //     return (await contract.methods.isFollower(this.state.account, address).call() === true);
            // })
        
        const following = isFollowing.map(address => {
            return <CreatorCard account={address} />
        });

        this.setState({ following });
    }

    render() {
        let following;
        if (this.state.following && this.state.following.length > 0) {
            following = this.state.following;
        } else {
            following = <h5 className="mt-5">You are not following anyone.</h5>
        }

        return (
            <>
                <Jumbotron>
                    <Container>
                        <h1>Following</h1>
                    </Container>
                </Jumbotron>
                <Container>
                    {following}
                </Container>
            </>
        );
    }
}

export default Following;
