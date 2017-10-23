<template> 
  <form class="well" v-if="account">
    <div class="form-group">
      <label>Post new message</label>
      <textarea class="form-control" :disabled="pending" v-model="message"></textarea>
    </div>
    <button class="btn btn-primary" :disabled="!message || pending" @click.prevent="post(message)">Post it!</button>
  </form>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      pending: false,
      message: ""
    }
  },
  computed: {
    ...mapState(["account"])
  },
  methods: {
    async post() {
      this.pending = true;
      await this.$store.dispatch("posts/post", this.message);
      this.pending = false;
      this.message = "";
    }
  }
}
</script>