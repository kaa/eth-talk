pragma solidity ^0.4.2;

contract Talk {
  event Posted (uint index);
  Post[] posts;
  struct Post {
    address author;
    uint timestamp;
    string message;
  }

  mapping(address => string) nicks;

  address public owner;

  function Talk() {
    owner = msg.sender;
  }

  function countPosts() constant returns (uint) {
    return posts.length;
  }

  function getPost(uint index) constant returns (address, string, uint, string) {
    require(index < posts.length);
    Post memory post = posts[index];
    string memory nick = nicks[post.author];
    return (post.author, nick, post.timestamp, post.message);
  }

  function nick(string nickName) {
    nicks[msg.sender] = nickName;
  }
  function getNick() constant returns (string) {
    return nicks[msg.sender];
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