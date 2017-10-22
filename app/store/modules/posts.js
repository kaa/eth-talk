import { contracts } from '../../contracts.js'

export default {
  namespaced: true,
  state: {
    posts: [],
    offset: 0,
    totalCount: null
  },
  getters: {
    posts: state => state.posts
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
      var count = await contracts.talk.countPosts();
      commit('totalCount', count.toNumber());
      var posts = await Promise.all(
        Array(state.totalCount).fill()
          .map((_,i) => contracts.talk.getPost(i))
      );
      commit('posts', posts.map(t => ({ author: t[0], message: t[1] })));
    },
    async post({state, rootState, commit, dispatch}, message) {
      if(!message || !message.length) return;
      if(!rootState.account.address) return;
      await contracts.talk.post(message, { from: rootState.account.address });
      dispatch("refresh");
    }
  }
}