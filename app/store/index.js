import Vue from 'vue'
import Vuex from 'vuex'
import { contracts } from '../contracts.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: null,
    errors: [],
    txWatches: []
  },
  mutations: {
    account(state, account) {
      state.account = account;
    },
    balance(state, balance) {
      state.account = { address: this.state.account.address, balance };
    },
    addError(state, message) {
      state.errors.push(message);
    },
    addTxWatch(state, {tx, message}) {
      state.txWatches.push({tx, message, status: "pending"});
    }
  },
  actions: {
    refreshBalance({state, commit}) {
      if(state.account==null) return;
      web3.eth.getBalance(state.account.address,(err,balance) => {
        if(err) return commit("addError", "Unable to get balance "+err);
        commit("balance", parseFloat(web3.fromWei(balance)));
      })
    },
    watchCurrentAccount({state, commit, dispatch}) {
      var account;
      (function poll() {
        web3.eth.getAccounts((err,acc) => {
          setTimeout(poll, 500);
          if(acc[0] == account) return;
          account = acc[0];
          if(!account) {
            return commit("account", null);
          }
          commit("account", { address: account });
          dispatch("refreshBalance");
        });
      })();
    }
  }
})