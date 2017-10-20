console.log("BOO");

// Import libraries we need.
import { default as Web3} from 'web3';
import Vue from 'vue';
import App from './App.vue';
import { initializeContracts } from './contracts';

window.addEventListener("load", () => {
  if(typeof web3 === "undefined") {
    console.warn("Not web3 found");
    return;
  }
  initializeContracts(web3.currentProvider);

  console.log("boo,");
  window.web3 = new Web3(web3.currentProvider);
  new Vue({
    el: '#talkapp',
    render: h => h(App)
  })
});
