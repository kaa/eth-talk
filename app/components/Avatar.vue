<template>
  <img style="margin: 0 5px 0 0" :src="identicon" />
</template>
<script>
import Identicon from 'identicon.js';

export default {
  props: ["address"],
  computed: {
    identicon() {
      return "data:image/svg+xml;base64,"+new Identicon(this.address, { format: 'svg', background: [0,0,0,0], size:15, margin: 0}).toString();
    }
  }
}
</script>