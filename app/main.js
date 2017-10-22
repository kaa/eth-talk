import { default as Web3} from 'web3';
import Vue from 'vue';
import App from './App.vue';
import { initializeContracts } from './contracts';
import store from './store.js';

window.addEventListener("load", async () => {
  if(typeof web3 === "undefined") {
    console.warn("Not web3 found");
    return;
  }
  window.web3 = new Web3(web3.currentProvider);
  var account;
  (function watchAccount() {
    web3.eth.getAccounts((err,acc) => {
      setTimeout(watchAccount, 500);
      if(acc[0] == account) return;
      account = acc[0];
      store.commit("account", { address: account });
      store.dispatch("refreshBalance");
    });
  })();
  await initializeContracts(web3.currentProvider);
  new Vue({
    store,
    el: '#talkapp',
    render: h => h(App)
  });
});