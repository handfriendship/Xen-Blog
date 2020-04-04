<template>
  <tr>
    <td scope="col">{{index}}</td>
    <td scope="col" @click="link" v-html="post.title"></td> <!--{{post.comments.length}}--> <!--query 이용해서 검색결과와 매칭되는 것에 하이라이트 주기-->
    <td scope="col" v-html="post.author"></td>
    <td scope="col" v-html="post.curTime"></td>
  </tr>
</template>

<script>
export default {
  props: ['post', 'index', 'keyword'],
  data (){
    return {
      msg: 'Hello World'
    }
  },
  created() {

  },
  methods: {
    link: function(){ //, params: {postId: index, post: post}
      this.$emit('link', this.post.postID);
      if(this.keyword){
        var queryStr = {...this.post};
        delete queryStr.postID;
        this.$router.push({name: 'PostViewPage', params: {postId: this.index}, query: queryStr});
      } else {
        this.$router.push({name: 'PostViewPage', params: {postId: this.index} });
      }

      //<router-link :to="{ name:'PostViewPage', params:{postId: index}}">{{post.title}}[0]</router-link>
    },
    clicktest: function(){
      console.log("clicktest called!");
    }
  }
}
</script>

<style>
tr > td:nth-child(2):hover {cursor: pointer;}
em {font-weight:bold;background-color:yellow;}
</style>
