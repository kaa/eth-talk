<template>
  <nav v-if="totalCount > 0">
    <ul class="pagination">
      <li v-if="currentPage == 1" class="disabled"><span aria-hidden="true">&laquo;</span></li>
      <li v-else><a href="#" v-on:click.prevent="$emit('change', currentPage-1)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
			<template v-for="ix in range(start,end - 1)">
        <li v-if="ix==currentPage-1" class="active"><span>{{ix+1}}</span></li>
        <li v-else><a href="#" v-on:click.prevent="$emit('change', ix+1)">{{ix+1}}</a></li>
			</template>
      <li v-if="currentPage==pageCount" class="disabled"><span aria-hidden="true">&raquo;</span></li>
      <li v-else><a href="#" v-on:click.prevent="$emit('change', currentPage+1)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
    </ul>
  </nav>
</template>
<script>
import { range } from '../util.js';

export default {
  props: {
    totalCount: { type: Number },
    currentPage: { type: Number },
    pageSize: { type: Number, default: 10 }, 
    windowSize: { type: Number, default: 10 }
  },
  methods: {
    range
  },
  computed: {
    pageCount() {
      return Math.floor(this.totalCount/this.pageSize) + ((this.totalCount%this.pageSize) == 0 ? 0 : 1);
    },
    start() {
      return this.currentPage + this.windowSize/2 <= this.pageCount
        ? Math.max(0, this.currentPage - 1 - this.windowSize/2)
        : Math.max(0, this.pageCount - this.windowSize);
    },
    end() {
      return this.currentPage + this.windowSize/2 <= this.pageCount
        ? Math.min(this.pageCount, this.start + this.windowSize)
        : this.pageCount;
    }
  }
}
</script>
