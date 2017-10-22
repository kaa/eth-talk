<template>
  <div class="container">
    <div v-if="error" style="color: red">{{error}}</div>
    <div class="form-group">
      <textarea class="form-control" v-model="message"></textarea>
    </div>
    <div class="form-group">
      <button class="btn btn-primary" :disabled="!message" @click.prevent="postMessage">Post it!</button>
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
      error: null,
      accountBalance: null,
      message: ""
    }
  },
  methods: {
    getDefaultAccount() {
      return new Promise((res,rej) => 
        web3.eth.getAccounts(async (err,accounts) => err ? rej(err) : res(accounts[0]))
      );
    },
    async postMessage() {
      this.message = "";
      var hash = sha("sha256").update(this.message).digest("hex");
      var account = await this.getDefaultAccount();
      contracts.talk
        .then(talk => talk.post(hash, { from: account }))
        .then(tx => console.log(tx))
        .catch(err => this.error = err)
    }
  },
  async mounted() {
    let account = await this.getDefaultAccount();
    let balance = await new Promise((res,rej) => 
      web3.eth.getBalance(account,(err,balance) => err ? rej(err) : res(web3.fromWei(balance)))
    );
    this.accountBalance = parseFloat(balance);
  }
}
</script>
<style>
  @import "../node_modules/bootstrap/dist/css/bootstrap.css"
</style>