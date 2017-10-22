import Vue from 'vue'
import Vuex from 'vuex'
import { contracts } from '../contracts.js'
import posts from './modules/posts.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: null,
    errors: []
  },
  mutations: {
    account(state, account) {
      state.account = account;
    },
    balance(state, balance) {
      state.account = { address: this.state.account.address, balance };
    }
  },
  actions: {
    async refreshBalance({state, commit}) {
      let account = state.account;
      if(account==null) return;
      web3.eth.getBalance(account.address,(err,balance) => {
        if(err) return commit("addError", "Unable to get balance "+err);
        commit("balance", parseFloat(web3.fromWei(balance)));
      })
    }
  },
  modules: { posts }
})