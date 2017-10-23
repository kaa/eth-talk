import { contracts } from '../../contracts.js'
import { range } from '../../util.js'

const PAGE_SIZE = 10;

export default {
  namespaced: true,
  state: {
    posts: [],
    offset: 0,
    totalCount: null
  },
  getters: {
    posts: state => state.posts,
    pages: state => state.totalCount/PAGE_SIZE
  },
  mutations: {
    posts(state, posts) {
      state.posts = posts;
    },
    totalCount(state, value) {
      state.totalCount = value;
    }
  },
  actions: {
    async refresh({state, commit, dispatch}) {
      var count = (await contracts.talk.countPosts()).toNumber();
      commit('totalCount', count);
      var start = state.totalCount - state.offset - 1;
      var end = start - Math.min(PAGE_SIZE, state.totalCount);
      var posts = await Promise.all(
        range(start, end).map(contracts.talk.getPost)
      );
      commit('posts', posts.map(t => ({ 
        author: t[0], 
        timestamp: new Date(t[1].toNumber()*1000), 
        message: t[2] 
      })));
    },
    async post({state, rootState, commit, dispatch}, message) {
      if(!message || !message.length) return;
      if(!rootState.account) return dispatch("addError", "Must be logged in to post", {root: true });
      var receipt = await contracts.talk.post(message, { from: rootState.account.address });
      commit("addTxWatch", { tx: receipt.tx, message: "Pending post" }, { root: true });
    }
  }
}
