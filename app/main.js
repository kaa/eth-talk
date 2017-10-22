import { default as Web3} from 'web3';
import Vue from 'vue';
import App from './App.vue';
import { initializeContracts } from './contracts';
import store from './store';

window.addEventListener("load", async () => {
  if(typeof web3 === "undefined") {
    console.warn("Not web3 found");
    return;
  }

  window.web3 = new Web3(web3.currentProvider);
  watchAccount();

  await initializeContracts(web3.currentProvider);
  new Vue({
    store,
    el: '#talkapp',
    render: h => h(App)
  });
});

function watchAccount() {
  var account;
  (function poll() {
    web3.eth.getAccounts((err,acc) => {
      setTimeout(poll, 500);
      if(acc[0] == account) return;
      account = acc[0];
      store.commit("account", { address: account });
      store.dispatch("refreshBalance");
    });
  })();
}