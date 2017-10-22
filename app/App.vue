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
      <div class="panel panel-default" v-for="post in posts">
        <div class="panel-heading">{{post.author}} {{post.timestamp}}</div>
        <div class="panel-body">
          {{post.message}}
        </div>
      </div>
      <div class="form-group">
        <textarea class="form-control" v-model="message"></textarea>
      </div>
      <div class="form-group">
        <button class="btn btn-primary" :disabled="!message" @click.prevent="post(message)">Post it!</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions, createNamespacedHelpers } from 'vuex'

export default {
  data() {
    return {
      message: ""
    }
  },
  computed: {
    ...mapState(["account","errors"]),
    ...mapState("posts", ["posts"])
  },
  methods: {
    ...mapActions("posts", ["refresh", "post"])
  },
  mounted() {
    this.refresh();
  }
}
</script>
<style>
  @import "../node_modules/bootstrap/dist/css/bootstrap.css";
</style>