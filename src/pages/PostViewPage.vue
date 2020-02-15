<template>
  <div class="post-view-page">
    <PostView :curPost="curPost" @update:post="curPost" @sendAuthor="getAuthorFromChild" :index="$route.params.postId">
      <!-- 지금 이 props가 늦게오는 문제를 slot 으로도 해결할 수 있음 ! -->
    </PostView>
    <p></p>
    <!-- <router-link :to="{name:'PostEditPage', params: {author: author}}">수정</router-link> -->
    <button type="button" @click="editing">수정</button>
    <button type="button" @click="deleting">삭제</button>
    <router-link to="/">목록</router-link>
    <!-- <comment-list :comments="propsPost.post.comments" :currentUser="currentUser"
                  @editComment="editComment" @delComment="delComment"></comment-list>
    <comment-form @addCom="addComment"></comment-form> -->
  </div>
</template>

<script>
import PostView from '@/components/PostView'
import {mapMutations, mapActions, mapState} from 'vuex';
// import CommentForm from '@/components/CommentForm';
// import CommentList from '@/components/CommentList';

export default {
  name: 'PostViewPage',
  components: {
    'PostView': PostView,
  },
  created(){
    console.log("PostViewPage => created called!");
    this.fetchPostByIndex(this.$route.params.postId);
  },
  updated() {
    console.log("PostViewPage => updated called!");
    console.log("PostViewPage => updated => this.curPost : ", this.curPost);
  },
  data (){
    return {
      post: {}, data: 'data1', author: '',
    }
  },
  props: {

  },
  methods: {
    getAuthorFromChild: function(author){
      this.author = author;
    },
    deleting: function(){
      console.log("this.user.displayName : ", this.user.displayName);
      console.log("this : ", this.author);
      if(!this.user.displayName){
        alert("로그인이 필요합니다!");
        this.$router.push( {name: 'Signin'} );
        return false;
      } else if(this.user.displayName !== this.author){
        alert("자신의 게시물이 아닌 게시물은 삭제하실 수 없습니다.");
        return false;
      }
      alert("게시글이 성공적으로 삭제되었습니다!");
      this.deletePostByIndex(this.$route.params.postId);
    },
    editing: function(){
      if(!this.user.displayName){
        alert("로그인이 필요합니다!");
        this.$router.push( {name: 'Signin'} );
        return false;
      } else if(this.user.displayName !== this.author){
        alert("자신의 게시물이 아닌 게시물은 수정하실 수 없습니다.");
        return false;
      }
      this.$router.push({name: 'PostEditPage'});
    },

    ...mapMutations([
      'FETCH_POST_BY_INDEX'
    ]),
    ...mapActions([
      'fetchPostByIndex', 'deletePostByIndex',
    ]),
  },
  computed: {
    ...mapState(['curPost', 'user']),
  }

}
</script>

<style>

</style>
