<template>
  <div>
    <PostCreateForm @register="register"></PostCreateForm>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import PostCreateForm from '@/components/PostCreateForm';

export default {
  name: 'create',
  props: ['posts', 'propsdata', 'msg', 'getCurrentTime'],
  components: {
    'PostCreateForm': PostCreateForm,
  },
  created(){
    console.log("this.$route.params : ", this.$route.params);
    console.log("posts : ", this.posts);
  },
  methods: {
    register: function(payload){
      var {title, content} = payload;
      var curTime = this.getCurrentTime();
      var author = this.user.displayName;
      var postID = new Date().getTime().toString();
      var comments = [];
      // var info = {
      //   'comments': [],
      //   'title': title,
      //   'contents': content,
      //   'createdAt': createdAt,
      // }
      // this.$emit('postRegister', {'title':title, 'content':content, 'curTime':curTime, 'author':author, 'postID':postID, 'comments':comments});
      console.log("before createPage");
      this.createPage({'title':title, 'content':content, 'curTime':curTime, 'author':author, 'postID':postID, 'comments':comments});
    },
    ...mapActions([
      'createPage'
    ])
  },
  computed: {
    ...mapState([
      'user'
    ])
  }

}
</script>

<style>

</style>
