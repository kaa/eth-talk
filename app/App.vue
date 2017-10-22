<template>
  <div class="app">
    <nav class="navbar navbar-default">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">
            eth-talk
          </a>
        </div>
        <p class="navbar-text navbar-right">
          <template v-if="account">
            Signed in {{account.address}} 
            <template v-if="account.balance">{{account.balance}} ETH</template>
          </template>
          <template v-else>Not signed in</template>
        </p>
      </div>
    </nav>
    <div class="container">
      <div class="alert alert-danger alert-dismissable" v-for="err in errors">{{err}}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      </div>
      <div class="panel panel-default" v-for="post in posts">
        <div class="panel-heading">{{post.author}}</div>
        <div class="panel-body">
          {{post.message}}
        </div>
      </div>
      <div class="form-group">
        <textarea class="form-control" v-model="message"></textarea>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="!message" @click.prevent="postMessage">Post it!</button>
      </div>
    </div>
  </div>
</template>
<script>
import sha from 'sha.js';
import { default as Web3} from 'web3';
import { contracts } from './contracts';

export default {
  data() {
    return {
      message: ""
    }
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    errors() {
      return this.$store.state.errors;
    },
    posts() {
      return this.$store.state.posts;
    }
  },
  methods: {
    async postMessage() {
      if(!this.message || !this.message.length) return;
      this.$store.dispatch("postMessage", this.message);
    }
  },
  mounted() {
    this.$store.dispatch("refreshPosts");
  }
}
</script>
<style>
  @import "../node_modules/bootstrap/dist/css/bootstrap.css";
</style>