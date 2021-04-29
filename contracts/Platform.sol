// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;
pragma experimental ABIEncoderV2;

import "./lib/math/SafeMath.sol";

contract Platform {

    using SafeMath for uint256;

    struct Creator {
        uint id;
        string name;
        string photoHash;
        address addr;
        uint256 fee;
        uint256 postCount;
        uint256 followerCount;
        uint256 creatorSince;
    }

    struct Post {
        uint id;
        string title;
        uint createdOn;
        address creator;
        string tags; //separate by commas
    }

    Post[] public posts;
    Creator[] public creators;

    mapping (uint => string) private postIdToHash;

    mapping (address => uint) public addressToCreatorId;
    mapping (address => bool) public isCreator;
    mapping (address => uint[]) public creatorToPostIds;
    mapping (address => mapping(address => bool)) public isFollower;

    modifier onlyCreator() {
        require(isCreator[msg.sender], "You are not a creator");
        _;
    }

    event NewCreator(address creator, string name, uint fee);
    event NewPost(string title, address creator);
    event CreatorFollowed(address indexed user, address indexed creator, uint indexed fee);
    event CreatorUnfollowed(address indexed user, address indexed creator, uint indexed fee);
    event StreamUpdate(address indexed from, address indexed to, uint indexed amount, uint time);

    function addCreator(string memory _name, string memory _photoHash, uint _fee) external {
        require(!isCreator[msg.sender], "You are already a creator");

        isCreator[msg.sender] = true;
        uint id = creators.length;
        Creator memory newCreator = Creator(id, _name, _photoHash, msg.sender, _fee, 0, 0, block.timestamp);
        creators.push(newCreator);
        addressToCreatorId[msg.sender] = id;

        emit NewCreator(msg.sender, _name, _fee);
    }

    function getCreators() external view returns (address[] memory, uint) {
        address[] memory list = new address[](creators.length);

        for (uint i=0; i<creators.length; i++) {
            list[i] = creators[i].addr;
        }

        return (list, list.length);
    }

    function getCreatorByAddress(address _addr) external view returns (Creator memory) {
        uint id = addressToCreatorId[_addr];
        return creators[id];
    }

    function createPost(string memory _docHash, string memory _title, string memory _tags) external onlyCreator {
        uint id = posts.length;
        posts.push(Post(id, _title, block.timestamp, msg.sender, _tags));
        creatorToPostIds[msg.sender].push(id);

        postIdToHash[id] = _docHash;

        Creator storage myCreator = creators[addressToCreatorId[msg.sender]];
        myCreator.postCount = (myCreator.postCount).add(1);

        emit NewPost(_title, msg.sender);
    }

    function getPosts() external view returns (string[] memory, uint) {
        string[] memory list = new string[](posts.length);

        for (uint i=0; i<posts.length; i++) {
            list[i] = posts[i].title;
        }

        return (list, list.length);
    }

    function canViewPost(uint _id) public view returns (bool) {
        Post memory myPost = posts[_id];
        if (isFollower[msg.sender][myPost.creator] || myPost.creator == msg.sender) {
            return true;
        } else {
            return false;
        }
    }

    function viewPost(uint _id) external view returns (Post memory) {
        Post memory myPost = posts[_id];

        require(canViewPost(_id), "You are not a follower");

        return myPost;
    }

    function getCreatorPosts(address _addr) external view returns (uint[] memory) {
        uint[] memory list = new uint[](creatorToPostIds[_addr].length);

        for (uint i=0; i<list.length; i++) {
            list[i] = creatorToPostIds[_addr][i];
        }

        return list;
    }

    function followCreator(address _addr) external {
        Creator storage myCreator = creators[addressToCreatorId[_addr]];

        require(!isFollower[msg.sender][_addr], "You are already a follower");
        // require(msg.value == myCreator.content_fee, "Pay correct fee to follow creator");

        isFollower[msg.sender][_addr] = true;

        myCreator.followerCount = (myCreator.followerCount).add(1);

        emit CreatorFollowed(msg.sender, _addr, myCreator.fee);
        emit StreamUpdate(msg.sender, _addr, myCreator.fee, block.timestamp);
    }

    function unfollowCreator(address _addr) external {
        require(isFollower[msg.sender][_addr], "You are not a follower");

        isFollower[msg.sender][_addr] = false;

        Creator storage myCreator = creators[addressToCreatorId[_addr]];
        myCreator.followerCount = (myCreator.followerCount).sub(1);

        emit CreatorUnfollowed(msg.sender, _addr, myCreator.fee);
        emit StreamUpdate(msg.sender, _addr, 0, block.timestamp);
    }

}
