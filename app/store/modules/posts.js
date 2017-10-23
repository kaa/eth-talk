import { contracts } from '../../contracts.js'
import { range } from '../../util.js'

export default {
  namespaced: true,
  state: {
    posts: [],
    pageSize: 10,
    currentPage: 1,
    totalCount: null
  },
  getters: {
    pages: state => state.totalCount / state.pageSize
  },
  mutations: {
    posts(state, { posts, page, totalCount }) {
      state.posts = posts;
      state.totalCount = totalCount;
      state.currentPage = page;
    }
  },
  actions: {
    async showPage({state, commit, dispatch}, page = 1) {
      var totalCount = (await contracts.talk.countPosts()).toNumber();
      var offset = (page-1)*state.pageSize;
      var start = totalCount - offset - 1;
      var end = Math.max(0, start - state.pageSize);
      var rawPosts = await Promise.all(
        range(start, end).map(contracts.talk.getPost)
      );
      var posts = rawPosts.map(t => ({ 
        author: t[0], 
        timestamp: new Date(t[1].toNumber()*1000), 
        message: t[2] 
      }));
      commit('posts', { posts, page, totalCount });
    },

    async post({state, rootState, commit, dispatch}, message) {
      if(!message || !message.length) return;
      if(!rootState.account) return dispatch("addError", "Must be logged in to post", {root: true });
      var receipt = await contracts.talk.post(message, { from: rootState.account.address })
        .on("confirmation", (nr,rec) => console.log("received confirmation", nr, "for tx", rec));
      commit("addTxWatch", { tx: receipt.tx, message: "Pending post" }, { root: true });
    }
  }
}
