<template>
  <div class="app">
    <nav class="navbar navbar-default">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">
            eth-talk
          </a>
        </div>
        <p class="navbar-text navbar-right">
          <template v-if="account">
            Signed in {{account.address}} 
            <template v-if="account.balance">{{account.balance}} ETH</template>
          </template>
          <template v-else>Not signed in</template>
        </p>
      </div>
    </nav>
    <div class="container">
      <div :class="['alert', watch.status=='pending' ? 'alert-info' : 'alert-success']" v-for="watch in txWatches">{{watch.message}}</div>
      <div class="alert alert-danger alert-dismissable" v-for="err in errors">{{err}}</div>
      <Postlist />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Postlist from './components/Postlist.vue';

export default {
  components: {
    Postlist
  },
  data() {
    return {
      message: ""
    }
  },
  computed: {
    ...mapState(["account","errors","txWatches"])
  }
}
</script>
<style>
  @import "../node_modules/bootstrap/dist/css/bootstrap.css";
</style>