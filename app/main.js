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
  store.dispatch("watchCurrentAccount");
  watchPendingTransactions();

  await initializeContracts(web3.currentProvider);
  new Vue({
    store,
    el: '#talkapp',
    render: h => h(App)
  });
});

async function watchPendingTransactions() {
  var watchPromises = store.state.txWatches
    .filter(t => t.status === "pending")
    .map(async t => new Promise((res,rej) => {
      web3.eth.getTransactionReceipt(t.tx, (err,receipt) => {
        if(err) return rej(err);
        if(!receipt) return res();
        t.status = "completed";
        res();
      });
    }));
  await Promise.all(watchPromises);
  setTimeout(watchPendingTransactions, 1000);
}