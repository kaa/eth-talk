import { default as Web3 } from 'web3';
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
  store.dispatch("watchCurrentAccount");
  store.dispatch("watchPendingTransactions");

  await initializeContracts(web3);
  new Vue({
    store,
    el: '#talkapp',
    render: h => h(App)
  });
});

