<template>
  <div>
    <Pagination :pageSize="pageSize" :totalCount="totalCount" :currentPage="currentPage" v-on:change="showPage"/>
    <div class="panel panel-default" v-for="post in posts">
      <div class="panel-heading">{{post.author}} {{post.timestamp}}</div>
      <div class="panel-body">
        {{post.message}}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Pagination from './Pagination.vue';

export default {
  components: {
    Pagination
  },
  computed: {
    ...mapState("posts", ["posts", "totalCount", "pageSize", "currentPage"])
  },
  methods: {
    ...mapActions("posts", ["showPage"])
  },
  mounted() {
    this.showPage();
  }
}
</script>