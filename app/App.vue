<template>
  <div class="app">
    <nav class="navbar navbar-default">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand" href="#">
            eth-talk
          </a>
        </div>
        <ul class="nav navbar-nav navbar-right" v-if="account">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <Nametag :address="account.address" :name="account.name"/>
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <li><a data-toggle="modal" data-target="#myModal" href="#">Change nickname</a></li>
            </ul>
          </li>
        </ul>
        <p v-else class="navbar-text navbar-right">Not signed in</p>
      </div>
    </nav>
    <div class="container">
      <div class="alert alert-danger alert-dismissable" v-for="err in errors">{{err}}</div>
      <Postlist />
    </div>
    <ProfileModal />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Postlist from './components/Postlist.vue';
import Nametag from './components/Nametag.vue';
import ProfileModal from './components/ProfileModal.vue';

window.jQuery = window.$ = require('jquery')
require('bootstrap/dist/js/bootstrap')

export default {
  components: {
    Postlist,
    Nametag,
    ProfileModal
  },
  data() {
    return {
      showProfileModal: false
    }
  },
  computed: {
    ...mapState(["account","errors"])    
  }
}
</script>
<style>
  @import "../node_modules/bootstrap/dist/css/bootstrap.css";
</style>