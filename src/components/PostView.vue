<template>
  <div class="post-view">
    <div>
      <h1>{{curPost.title}}</h1>
      <span>게시물 번호 {{index}}</span>
      <strong v-html="this.curPost.author + this.middledot + this.curPost.curTime"></strong>
    </div>
    <p v-html="curPost.content"></p>
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

    }
  },
  data (){
    return {
      middledot: " &middot; "
    }
  },
  created(){
    console.log("postview created!");
    console.log("PostView -> created -> this.curPost : ", this.curPost);
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

</style>
