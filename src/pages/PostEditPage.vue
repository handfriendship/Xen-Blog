<template>
  <div>
    <PostEditForm :curPost="curPost" @update="console.log('updated hook called111!')" @edit="edit"></PostEditForm>

    this.postFromRoute : {{postFromRoute}}
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';
import PostEditForm from '@/components/PostEditForm';

export default {
  name: 'PostEditPage',
  components: {
    'PostEditForm': PostEditForm,
  },
  props: {
    getCurrentTime: {
      type: Function,
    },
  },
  data() {
    return {
      postFromRoute: '', componentkey: 0,
    }
  },
  created(){
    console.log("PostEditPage => created");
    this.fetchPostByIndex(this.$route.params.postId);
  },
  updated() {
    console.log("PostEditPage updated hook called");
    console.log("PostEditPage - curPost : ", this.curPost);

  },
  methods: {
    fetchPropsPost: function(){
      this.$emit('fetchEdit', this.$route.params.postId);
    },
    edit: function(payload){
      alert("게시물이 성공적으로 수정되었습니다.");
      console.log("edit : payload : ", payload);
      // var {title, content} = payload;
      var postID = this.curPost.postID;
      var curTime = this.getCurrentTime();
      this.editPostByID({...payload, postID: postID, postId: this.$route.params.postId, curTime: curTime});
      
    },
    ...mapActions([
      'fetchPostByIndex', 'editPostByID',
    ])
  },
  computed: {
    ...mapState([
      'curPost',
    ])
  }
}
</script>

<style>

</style>
