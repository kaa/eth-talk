<template>
  <div>
    <div v-if="error" style="color: red">{{error}}</div>
    <h1>Hi, I'm a huge idiot</h1>
    <p v-if="!accountBalance">And I'm a broke sucker</p>
    <p v-else>But I'm a rich fucker with {{accountBalance}} ether!</p>
    <textarea v-model="message"></textarea>
    <button :disabled="!message" @click.prevent="postMessage">Post it!</button>
  </div>
</template>
<script>
import sha from 'sha.js';
import { default as Web3} from 'web3';
import { Talk } from './contracts';
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
      console.log("Posting message "+this.message);
      var hash = sha("sha256").update(this.message).digest("hex");
      var account = await this.getDefaultAccount();
      Talk.deployed()
        .then(talk => { console.log("Deployed"); return talk.post(hash, { from: account }) })
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