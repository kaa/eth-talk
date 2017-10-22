import Vue from 'vue'
import Vuex from 'vuex'
import { contracts } from './contracts.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: null,
    errors: [],
    posts: [],
    offset: 0,
    postCount: null
  },
  mutations: {
    account(state, account) {
      state.account = account;
    },
    balance(state, balance) {
      state.account = { address: this.state.account.address, balance };
    },
    posts(state, posts) {
      state.posts = posts;
    },
    postCount(state, value) {
      state.postCount = value;
    },
    addError(state, error) {
      state.errors.push(error);
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
    },
    async refreshPosts({state, commit, dispatch}) {
      var countBig = await contracts.talk.countPosts();
      var count = countBig.toNumber();
      commit('postCount', count);
      console.log(count,"posts");
      var posts = await Promise.all(
        Array(count).fill().map((_,i) => contracts.talk.getPost(i))
      );
      console.log("found",posts);
      commit('posts', posts.map(t => ({ author: t[0], message: t[1] })));
    },
    async postMessage({state,commit,dispatch},message) {
      if(!state.account.address) return;
      await contracts.talk.post(message, { from: state.account.address });
      dispatch("refreshPosts");
    }
  }
})