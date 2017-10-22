<template> 
  <form>
    <div class="form-group">
      <textarea class="form-control" :disabled="pending" v-model="message"></textarea>
    </div>
    <div class="form-group">
      <button class="btn btn-primary" :disabled="!message || pending" @click.prevent="post(message)">Post it!</button>
    </div>
  </form>
</template>
<script>
export default {
  data() {
    return {
      pending: false,
      message: ""
    }
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