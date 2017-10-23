<template>
  <div>
    <div class="panel panel-default" v-for="post in posts">
      <div class="panel-heading">{{post.author}} {{post.timestamp}}</div>
      <div class="panel-body">
        {{post.message}}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState("posts", ["posts"])
  }
}
</script>