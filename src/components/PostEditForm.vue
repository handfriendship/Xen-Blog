<template>
  <div class="post-edit-page">
    <form>
      <h1>게시물 수정</h1>
      <fieldset>
        <label>게시물 번호</label>
        <input type="text"
              disabled="disabled"
              :value="index">
        <label>게시물 생성일</label>
        <input type="text"
              disabled="disabled"
              :value="curPost.curTime">
        <label>제목</label>
        <input type="text"
              placeholder="게시물 제목을 입력해주세요."
              v-bind:value="curPost.title"
              ref="title"/>
        <label>내용</label>
        <!-- <textarea row="5"
                  placeholder="게시물 내용을 입력해주세요."
                  v-bind:value="curPost.content"
                  ref="content">
        </textarea> -->
        <textarea name="summeredit" id="summeredit" v-bind:value="curPost.content"></textarea>
        <button type="submit" @click="edit">수정하기</button>
        <router-link :to="{name:'PostViewPage', params:{postId: this.$route.params.postId}}">취소</router-link>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    curPost: {
      type: Object,
    },
  },
  data() {
    return {
      index: this.$route.params.postId,
    }
  },
  created(){
    console.log("PostEditForm created!");
    console.log("PostEditForm => created => this.curPost : ", this.curPost);
  },
  mounted(){
    console.log("PostEditForm mounted!");
    if(JSON.stringify(this.curPost) !== JSON.stringify({})) {
      $('#summeredit').summernote({
          tabsize: 2,
          height: 200,
          lang: 'ko-KR'
      });
    }
    console.log("this.curPostt : ", this.curPost);
  },
  updated(){
    console.log("PostEditForm updated called!");
    console.log("this.curPost : ", this.curPost);
  },
  methods: {
    edit: function(e){
      e.preventDefault();
      var title = this.$refs.title.value;
      var content = this.summeredit;
      this.$emit('edit', {title: title, content: content});
    },

  },
  computed: {
    summeredit() {
      return $('#summeredit').summernote('code');
    }
  },
  watch: {
    curPost() {
      console.log("watch - curPost changed!d", this.curPost);

      this.$nextTick(() => {
        $('#summeredit').summernote({
            tabsize: 2,
            height: 200,
            lang: 'ko-KR'
        });
      })


    }
  }
}
</script>

<style>

</style>
