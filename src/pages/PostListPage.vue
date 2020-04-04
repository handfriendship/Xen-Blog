<template>
  <div class="post-list-page">
    <div class="title-search">
      <h1 class="post-list-title">포스트 게시글</h1>
      <div class="search-area">
        <input type="radio" name="chk_info" value="All"
            v-model="picked" checked="checked" @click="selectAll"><span>All</span>
        <input type="radio" name="chk_info" value="title" v-model="picked"><span>Title</span>
        <input type="radio" name="chk_info" value="title,content" v-model="picked"><span>Title + Content</span>
        <input type="radio" name="chk_info" value="author" v-model="picked"><span>Author</span>
        <input class="search-input" type="text" placeholder="search here" @keyup="enterkey" v-model="keyword"/>
        <input class="search-btn" type="button" value="SEARCH" @click="search"/>
      </div>
    </div>
    <div>
      <table>
        <colgroup>
          <col style="width: 10%;"/>
          <col style="width: 60%;"/>
          <col style="width: 10%;"/>
          <col style="width: 20%;"/>
        </colgroup>
        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">작성자</th>
            <th scope="col">작성일</th>
          </tr>
        </thead>
        <tbody v-for="post in searchedPosts">
          <PostList @link="linkProps" v-bind:post="post" v-bind:index="getIndex(post)" v-bind:keyword="propsKeyword"></PostList>
        </tbody>
      </table>
    </div>
    <router-link :to="{path: '/post/create'}"><a>글쓰기</a></router-link>
    <div class="pagination-wrapper">
      <ul class="my-pagination pagination justify-content-end">
        <li class="page-item disabled"><a class="page-link" href="javascript:void(0);">Previous</a></li>
        <li v-for="pageNum in pageNumArr" class="page-item" @click="moveSelectedPage">
          <a class="page-link" href="javascript:void(0);">{{pageNum}}</a>
        </li>
        <li class="page-item"><a class="page-link" href="javascript:void(0);">Next</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import PostList from '../components/PostList.vue';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import { DropdownPlugin } from 'bootstrap-vue';

export default {
  name: 'PostListPage',
  components: {
    'PostList': PostList,
    'drop-down': DropdownPlugin,
  },
  props: {
    // posts: {
    //   type: Array,
    // }
  },
  data() {
    return {
      keyword: '', picked: 'All', searchedPosts: {}, propsKeyword: '', pageNumArr: [0,1,2,3,4,5],
    }
  },
  created() {
    // console.log("PostListPage => posts : ", this.posts);
    console.log("postListPage created");
    this.fetchPostList();
    // this.fetchPostByIndex();
  },
  methods: {
    getIndex: function(post){ // postID 가 똑같은걸로 구분해서 index 를 구해야한다 !
      var index = -1;

      this.posts.forEach(element => {
        if(element.postID == post.postID){
          index = this.posts.indexOf(element);
        }
      })
      return index;
    },
    linkProps: function(postID){
      this.$emit('linkProps', postID);
    },
    search: function(){
      var keyword = this.keyword;
      var picked = this.picked;
      this.algoliaSearch({keyword, picked});
    },
    enterkey: function(){
      if(window.event.keyCode == 13){
        this.search();
      }
    },
    selectAll: function(){
      this.keyword = '';
      this.computedPosts = this.posts;
      this.computedKeyword = '';
    },
    moveSelectedPage: function(){
      console.log("moveSelectedPage");
    },
    paginate: function(){
      console.log("paginate called!");
      // if(this.posts.length)
    },
    ...mapActions([
      'fetchPostList', 'fetchPostByIndex', 'algoliaSearch'
    ]),
    ...mapMutations(['REFINED_SEARCHED']),
  },
  computed: {
    ...mapState(['posts', 'searched']),
    ...mapGetters(['refinedSearched', 'testGetter']),
    computedPosts: {
      get: function() {
        return this.searchedPosts;
      },
      set: function(newValue){
        this.searchedPosts = {...newValue};
      }
    },
    computedKeyword: {
      get: function() {
        return this.propsKeyword;
      },
      set: function(newValue){
        this.propsKeyword = newValue;
      }
    },
    computedRefinedSearched(){
      return this.$store.getters.refinedSearched(this.picked);
    }
  },
  watch: {
    posts() {
      this.searchedPosts = this.posts;

    },
    searched() {
      this.searchedPosts = this.computedRefinedSearched;
    },
    searchedPosts() {
      var tempArr = new Array();
      for(let i=1; i<this.searchedPosts.length / 2 + 1; i++){
        tempArr.push(i);
      }
      this.pageNumArr = tempArr;
    },
  }

}
</script>

<style scoped>
  .title-search {display:flex;flex-flow:row wrap;justify-content:space-between;align-items:center;margin-bottom:30px;}
  .post-list-title {margin:0;}

  .search-area {}
  .search-input {border-radius:25px;padding:5px 10px;border:1px solid black;}
  .search-btn {background-color:#fff;border-radius:50px;width:90px;background-color:#f0f0f0;cursor:pointer;}
  .search-btn:hover {background: linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%); transition:ease-in-out 1.0s;}

  .pagination-wrapper {padding:70px 0px;}
</style>
