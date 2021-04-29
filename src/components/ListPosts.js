import React, { Component } from 'react';
import getContract from '../ethereum/getContract';
import PostCard from './cards/PostCard';

class PostList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            allowed: null,
            postIds: null,
            posts: null
        };
    }

    async componentDidMount() {
        const contract = await getContract();
        const postIds = await contract.methods.getCreatorPosts(this.props.account).call();
        this.setState({ postIds });

        const posts = this.state.postIds.map(id => {
            return <PostCard postId={id} account={this.props.account} key={id} />
        });

        this.setState({ posts });
    }

    render() {
        return (
            <>
                {this.state.posts}
            </>
        );
    }
}

export default PostList;
