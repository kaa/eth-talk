pragma solidity ^0.4.2;

contract Talk {
  event Posted (uint index);

  struct Post {
    address author;
    uint timestamp;
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

  function getPost(uint index) constant returns (address, uint, string) {
    require(index < posts.length);
    Post memory post = posts[index];
    return (post.author, post.timestamp, post.message);
  }

  function post(string message) returns (uint) {
    uint latestPostId = posts.push(Post({
      author: msg.sender,
      timestamp: now,
      message: message
    }));
    Posted(latestPostId);
    return latestPostId;
  }
}