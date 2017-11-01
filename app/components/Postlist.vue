<template>
  <div>
    <form :class="editing||message ? 'well editing' : ''" v-if="account">
      <div class="form-group clearfix">
        <textarea class="message-box form-control" @blur="editing=false" @focus="editing=true" v-model="message" placeholder="Enter a message..."></textarea>
      </div>
      <template v-if="editing||message">
        <p class="pull-right help-block">Some markdown is welcome here</p>
        <button class="btn btn-primary" :disabled="!message" @click.prevent="post(message)">Submit post</button>
        <a class="btn btn-link" href="#" @click.prevent="evt => { message=null; evt.target.blur() }">Cancel</a>
      </template>
    </form>
    <Pagination :pageSize="pageSize" :totalCount="totalCount" :currentPage="currentPage" v-on:change="showPage"/>
    <div v-if="pending || posts" class="panel panel-default">
      <template v-for="post in pending">
        <div class="panel-heading"><Nametag title="true" :address="post.author"/> <span class="pull-right">Pending...</span></div>
      <div class="panel-body">
        {{post.message}}
      </div>
      </template>
      <template v-for="post in posts">
        <div class="panel-heading small"><Nametag title="true" :address="post.author"/> <span class="pull-right"><Timestamp :value="post.timestamp"/></span></div>
        <div class="panel-body">
          {{post.message}}
    </div>
      </template>
  </div>
    <Pagination :pageSize="pageSize" :totalCount="totalCount" :currentPage="currentPage" v-on:change="showPage"/>
  </div>
</template>
<script>
import { contracts } from '../contracts.js';
import { range } from '../util.js';
import Pagination from './Pagination.vue';
import Timestamp from './Timestamp.vue';
import Nametag from './Nametag.vue';
import { mapState } from 'vuex';

export default {
  components: {
    Pagination,
    Timestamp,
    Nametag
  },
  data() {
    return {
      editing: false,
      pending: [],
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

      var totalCount = parseInt(await contracts.talk.methods.countPosts().call());
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
        range(start, end).map(ix => contracts.talk.methods.getPost(ix).call())
      );
      this.totalCount = totalCount;
      this.currentPage = page;
      this.posts = rawPosts.map(t => ({ 
        author: t[0], 
        timestamp: new Date(parseInt(t[1])*1000), 
        message: t[2] 
      }));
    },

    async post() {
      if(!this.message || !this.message.length) return;
      var account = this.$store.state.account;
      if(!account) return this.$store.dispatch("addError", "Must be logged in to post");
      var post = { message: this.message.toString(), author: account.address, timestamp: new Date() };
      contracts.talk.methods.post(post.message)
        .send({from: account.address })
        .on("transactionHash", _ => {
          this.pending.push(post);
        this.message = "";
        })
        .on("receipt", async rcpt => {
          await delay(3000); // without automining in testrpc there is a delay
          await this.showPage();
          let ix = this.pending.indexOf(post);
          this.pending.splice(ix,1);
        })
        .on("error", err => {
          this.$store.dispatch("addError", "Unable to post "+err.toString());
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
<style>
  .help-block:last-child, .form-group:last-child {
    margin-bottom: 0;
  }
</style>
<style scoped>
  .message-box {
    height: 2.5em;
    resize: none;
  }
  .editing .message-box {
    height: 12em;
  }
  .editing .message-box::-webkit-input-placeholder { /* WebKit browsers */
      color: transparent;
  }
  .editing .message-box:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: transparent;
  }
  .editing .message-box::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: transparent;
  }
  .editing .message-box:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: transparent;
  }
</style>