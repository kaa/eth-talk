<template>
<span>
  <Avatar :address="address"/> 
  <template v-if="title"><abbr :title="address">{{name}}</abbr></template>
  <template v-else>{{name}}</template>
</span>
</template>
<script>
import Avatar from './Avatar.vue';

export default {
  props: ["address", "title", "nick"],
  components: {
    Avatar
  },
  computed: {
    name() {
      return this.nick || this.address.substring(0,10)+"...";
    }
  }
}
</script>