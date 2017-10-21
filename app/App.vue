<template>
  <div>
    <div v-if="error" style="color: red">{{error}}</div>
    <h1>Hi, I'm a huge idiot</h1>
    <p v-if="!accountBalance">And I'm a broke sucker</p>
    <p v-else>But I'm a rich fucker with {{accountBalance}} ether!</p>
    <textarea v-model="message"></textarea>
    <button :disabled="!message" @click.prevent="postMessage">Post it!</button>
    <hr>
    <p v-if="messagePosted">{{ messagePosted }}</p>
    <p>Transaction count: {{ txCount }}</p>
  </div>
</template>
<script>
import sha from 'sha.js';
import { default as Web3 } from 'web3';
import { Talk } from './contracts';
export default {
  data() {
    return {
      account: null,
      error: null,
      accountBalance: null,
      message: "",
      messagePosted: '',
      txCount: 0,
    }
  },
  methods: {
    getDefaultAccount() {
      return new Promise((res,rej) => 
        web3.eth.getAccounts(async (err,accounts) => err ? rej(err) : res(accounts[0]))
      );
    },
    getTransactionById(id) {
      return new Promise((res, rej) => {
        return web3.eth.getTransaction(id, (err, tx) => {
          return err ? rej(err) : res(tx)
        })
      });
    },
    getTransactionCount(id) {
      return new Promise((res, rej) => {
        return web3.eth.getTransactionCount(id, async (err, count) => {
          console.log(`account ${id} has ${count} tx`)
          return err ? rej(err) : res(count)
        })
      })
    },
    async postMessage() {
      console.log("Posting message "+this.message);
      //var hash = sha("sha256").update(this.message).digest("hex");
      var account = await this.getDefaultAccount();
      Talk.deployed()
        .then(talk => { console.log("Deployed"); return talk.post(this.message, { from: account }) })
        .then(tx => {          
          return this.getTransactionById(tx.tx)
        })
        .then(txData => {
          this.messagePosted = web3.toAscii(txData.input)
          //console.log('txData: ', web3.toAscii(txData.input))
        })
        .then(async () => {
          this.txCount = await this.getTransactionCount(this.account)
        })
        .catch(err => {this.error = err; console.log('err: ', err)})
    }
  },
  async mounted() {
    this.account =  await this.getDefaultAccount();
    this.txCount = await this.getTransactionCount(this.account);
    let balance = await new Promise((res,rej) => 
      web3.eth.getBalance(this.account,(err,balance) => err ? rej(err) : res(web3.fromWei(balance)))
    );
    this.accountBalance = parseFloat(balance);
  }
}
</script>