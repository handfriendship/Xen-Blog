<template>
  <div class="post-view">
    <div>
      <h1 v-if="JSON.stringify(query) == '{}'">{{curPost.title}}</h1>
      <h1 v-else v-html="query.title"></h1>
      <span>게시물 번호 {{index}}</span>
      <strong v-if="JSON.stringify(query) == '{}'" v-html="this.curPost.author + this.middledot + this.curPost.curTime"></strong>
      <strong v-else v-html="this.query.author + this.middledot + this.query.curTime"></strong>
    </div>
    <p v-if="JSON.stringify(query) == '{}'" v-html="curPost.content"></p>
    <p v-else v-html="query.content"></p>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';
export default {
  name: 'PostView',
  props: {
    curPost: {
      type: Object,
    },
    index: {

    },
    query: {
      type: Object,
    }
  },
  data (){
    return {
      middledot: " &middot; "
    }
  },
  created(){
    console.log("postview created!");
  },
  mounted(){
    this.$emit('sendAuthor', this.curPost.author);

  },
  updated(){
    this.$emit('sendAuthor', this.curPost.author);
  },
  watch: {

  }

}
</script>

<style>
em {font-weight:bold;background-color:yellow;}
</style>
