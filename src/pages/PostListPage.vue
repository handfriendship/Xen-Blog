<template>
  <div class="post-list-page">
    <div class="title-search">
      <h1 class="post-list-title">포스트 게시글</h1>
      <div class="search-area">
        <input type="radio" name="chk_info" value="All"
            v-model="picked" checked="checked" @click="selectAll"><span>All</span>
        <input type="radio" name="chk_info" value="Title" v-model="picked"><span>Title</span>
        <input type="radio" name="chk_info" value="Title + Content" v-model="picked"><span>Title + Content</span>
        <input type="radio" name="chk_info" value="Author" v-model="picked"><span>Author</span>
        <input class="search-input" type="text" placeholder="search here" v-model="keyword"/>
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
          <PostList @link="linkProps" v-bind:post="post" v-bind:index="getIndex(post)"></PostList>
        </tbody>
      </table>
    </div>
    <router-link :to="{path: '/post/create'}"><a>글쓰기</a></router-link>
  </div>
</template>

<script>
import PostList from '../components/PostList.vue';
import { mapGetters, mapState, mapActions } from 'vuex';
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
      keyword: '', picked: 'All', searchedPosts: {},
    }
  },
  created() {
    // console.log("PostListPage => posts : ", this.posts);
    console.log("postListPage created");
    this.fetchPostList();
    // this.fetchPostByIndex();
  },
  methods: {
    getIndex: function(post){
      return this.posts.indexOf(post);
    },
    linkProps: function(postID){
      this.$emit('linkProps', postID);
    },
    search: function(){
      var testArr = this.posts.map((k) => {
        return k.content;
      })
      var t = fromHtml(testArr[0]);
      var strData = t.toString();
      console.log("strData : ", strData);
      console.log("testArr : ", testArr);
      var filteredPosts = this.posts.filter((element) => {
        if(this.picked === 'Title + Content') return element.content.includes(this.keyword);
        else if(this.picked === 'Author') return element.author.includes(this.keyword);
        else if(this.picked === 'Title') return element.title.includes(this.keyword);
        else if(this.picked === 'All') return element;
        else return element;
      })
      var temp = (this.posts.filter((element2) => {
        if(this.picked === 'Title + Content') return element2.title.includes(this.keyword);
        else return ;
      }))
      console.log("searchedPosts : ", filteredPosts);
      this.searchedPosts = filteredPosts;
    },
    selectAll: function(){
      this.keyword = '';
      this.computedPosts = this.posts;
    },
    ...mapActions([
      'fetchPostList', 'fetchPostByIndex'
    ])
  },
  computed: {
    ...mapState(['posts']),
    computedPosts: {
      get: function() {
        return this.searchedPosts;
      },
      set: function(newValue){
        this.searchedPosts = {...newValue};
      }
    }
  },
  watch: {
    posts() {
      this.searchedPosts = this.posts;
    }
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
</style>
