<template>
  <div class="sign-up-page">
    <h3>회원가입</h3>
    <SignupForm @signup="signup" @signupWithGoogle="signupWithGoogle"></SignupForm>
    <p>
      이미 가입하셨나요? <router-link to="/signin">로그인 하러가기</router-link>
    </p>
  </div>
</template>

<script>
import SignupForm from '@/components/SignupForm';
import {mapActions} from 'vuex';

export default {
  name: 'Signup',
  components: {
    'SignupForm': SignupForm
  },
  methods: {
    signup: function(payload){
      console.log("signup in signup.vue");
      var userID = new Date().getTime();

      this.signupAction(payload);
      // this.$emit('signup', {...payload, userID: userID, authorized: false});
      // this.$router.push({name: 'Signin' });


    },
    signupWithGoogle: function(){
      this.signupWithGoogle();
    },
    ...mapActions(['signupAction', 'signupWithGoogle'])
  }

}
</script>

<style>

</style>
