<template>
  <div>
    <form class="well" v-if="account">
      <div class="form-group">
        <label>Post new message</label>
        <textarea class="form-control" :disabled="pending" v-model="message"></textarea>
      </div>
      <button class="btn btn-primary" :disabled="!message || pending" @click.prevent="post(message)">Post it!</button>
    </form>
    <Pagination :pageSize="pageSize" :totalCount="totalCount" :currentPage="currentPage" v-on:change="showPage"/>
    <div class="panel panel-default" v-for="post in posts">
      <div class="panel-heading">{{post.author}} {{post.timestamp}}</div>
      <div class="panel-body">
        {{post.message}}
      </div>
    </div>
  </div>
</template>
<script>
import { contracts } from '../contracts.js';
import { range } from '../util.js';
import Pagination from './Pagination.vue';
import { mapState } from 'vuex'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      pending: false,
      message: "",
      posts: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: 0
    }
  },
  computed: {
    pages: state => state.totalCount / state.pageSize,
    ...mapState(["account"])
  },
  methods: {
    async showPage(page) {
      page = page || this.currentPage;
      if(page==0) return;

      var totalCount = (await contracts.talk.countPosts()).toNumber();
      if(totalCount==0) {
        this.totalCount = 0;
        this.posts = [];
        this.currentPage = 0;
        return;
      }

      var offset = (page-1) * this.pageSize;
      var start = totalCount - offset - 1;
      var end = Math.max(0, start - this.pageSize);
      var rawPosts = await Promise.all(
        range(start, end).map(contracts.talk.getPost)
      );
      this.totalCount = totalCount;
      this.currentPage = page;
      this.posts = rawPosts.map(t => ({ 
        author: t[0], 
        timestamp: new Date(t[1].toNumber()*1000), 
        message: t[2] 
      }));
    },

    async post() {
      if(!this.message || !this.message.length) return;
      var account = this.$store.state.account;
      if(!account) return this.$store.dispatch("addError", "Must be logged in to post");
      var receipt = await contracts.talk.post(this.message, { from: account.address });
      this.pending = true;
      web3.eth.filter({address: contracts.talk.address}).watch((err,res) => {
        this.showPage();
        this.pending = false;
        this.message = "";
      });
    }
  },
  mounted() {
    this.showPage(1);
  }
}

function delay(time) {
  return new Promise((res,rej) => setTimeout(res,time));
}
function transactionPromise(tx) {
  return new Promise((resolve, reject) => {
    (function poll() {
      console.log("polling ",tx);
      web3.eth.getTransactionReceipt(tx, (err,receipt) => {
        if(err) return reject(err);
        console.log(receipt);
        if(receipt) return resolve(receipt);
        setTimeout(poll, 500);
      });
    })();
  })
}

</script>