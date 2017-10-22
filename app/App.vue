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
      <div :class="['alert', watch.status=='pending' ? 'alert-info' : 'alert-success']" v-for="watch in watches">{{watch.message}}</div>
      <div class="alert alert-danger alert-dismissable" v-for="err in errors">{{err}}</div>
      <Postbox />
      <div class="panel panel-default" v-for="post in posts">
        <div class="panel-heading">{{post.author}} {{post.timestamp}}</div>
        <div class="panel-body">
          {{post.message}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
import Postbox from './components/Postbox.vue';

export default {
  components: {
    Postbox
  },
  data() {
    return {
      message: ""
    }
  },
  computed: {
    ...mapState(["account","errors","watches"]),
    ...mapState("posts", ["posts"])
  },
  methods: {
    ...mapActions("posts", ["refresh"])
  },
  mounted() {
    this.refresh();
  }
}
</script>
<style>
  @import "../node_modules/bootstrap/dist/css/bootstrap.css";
</style>