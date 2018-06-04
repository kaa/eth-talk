import Vue from 'vue'
import Vuex from 'vuex'
import { contracts } from '../contracts.js'
//import Ipfs from 'ipfs'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: null,
    errors: [],
    ipfs: null
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
    ipfs(state, instance) {
      state.ipfs = instance;
    }
  },
  actions: {
    async initializeIPFS({state, commit}) {
/*      var ipfs = new Ipfs({
        init: false,
        start: false,
        repo: 'ipfs-' + Math.random()        
      });
      ipfs.init(() => {
        console.log("ipfs initialized");
        window.ipfs = ipfs;
        commit("ipfs", ipfs);
      });*/
    },
    async refreshBalance({state, commit}) {
      if(state.account==null) return;
      var balance = await web3.eth.getBalance(state.account.address);
      commit("balance", parseFloat(web3.utils.fromWei(balance)));
    },
    watchCurrentAccount({state, commit, dispatch}) {
      var lastAccount;
      (async function poll() {
        var accounts = await web3.eth.getAccounts();
        setTimeout(poll, 500);
        if(accounts[0] == lastAccount) return;
        lastAccount = accounts[0];
        if(!lastAccount) {
          return commit("account", null);
        }
        commit("account", { address: lastAccount });
        dispatch("refreshBalance");
      })();
    }
  }
})