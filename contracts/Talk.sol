pragma solidity ^0.4.2;

contract Talk {
  struct Post {
    address author;
    string message;
  }

  address public owner;
  Post[] public posts;

  function Talk() {
    owner = msg.sender;
  }

  function countPosts() constant returns (uint) {
    return posts.length;
  }

  function getPost(uint index) constant returns (address, string) {
    return (posts[index].author, posts[index].message);
  }

  function post(string message) returns (uint) {
    uint latestPostId = posts.push(Post({
      author: msg.sender,
      message: message
    }));
    return latestPostId;
  }
}