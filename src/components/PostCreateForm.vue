<template>
  <div class="post-create-page">
    <form method="post">
      <fieldset>
        <h1>게시물 작성하기</h1>
        <label>제목</label>
        <input type="text"
              placeholder="게시물 제목을 입력해주세요."
              v-model="title"/>
        <label>내용</label>
        <!-- <textarea name="ir1" id="ir1" rows="10" cols="100"
                  placeholder="게시물 내용을 입력해주세요."
                  v-model="content"></textarea> -->
        <!-- <div id="summernote" ref="summernote" v-model="content">

        </div> -->
        <textarea name="summernote" id="summernote" value="" v-model="content" ref="summernote"></textarea>

        <button type="submit" @click="register">작성하기</button>
        <router-link to="/">취소</router-link>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  data (){
    return {
      title: '', content: '', scriptObject: {},
    }
  },
  created(){
    console.log("PostCreateForm created!");
    // $('#summernote').summernote();

    // this.$refs.summernote.summernote();
  },
  mounted(){
    $('#summernote').summernote({
        placeholder: 'Hello Bootstrap 4',
        tabsize: 2,
        height: 100,
        lang: 'ko-KR'
      });
    console.log("ref : ", this.$refs.summernote);
    console.log("jquery : ", $('#summernote'));
  },
  methods: {
    register: function(e){
      e.preventDefault();
      var title = this.title;
      var content = this.summernote;
      // console.log("ref in register ; ", $('#summernote').summernote('code'));
      // console.log("ref in register ; ", this.$refs.summernote.summernote('code'));

      if(title === ""){
        alert("게시물 제목을 입력해주세요.");
      } else if(content === ""){
        alert("게시물 내용을 입력해주세요.");
      } else {
        alert("게시물이 성공적으로 작성되었습니다.");
        this.$emit('register', {title, content});
        // this.$router.push('/post/:postID');
        this.$router.push('/');
        // location.reload();
      }
    }
  },
  computed: {
    summernote(){
      return $('#summernote').summernote('code');
    }
  }
}
</script>

<style>
/* #summernote, .note-editing-area {min-height:200px;} */
</style>
