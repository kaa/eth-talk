<template>
  <abbr :title="value.toString()">{{value | humanized}}</abbr>
</template>
<script>
import humandate from 'human-date';

export default {
  props: ["value"],
  filters: {
    humanized(value) {
      return humandate.relativeTime(value)
    }
  }
}
</script>
<style>
abbr[title] { text-decoration: none; }
</style>