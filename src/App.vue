<template>
  <div id="app">
    <router-view name="header"/>
    <router-view :getCurrentTime="getCurrentTime" :emailExist="emailExist" :pwFetch="pwFetch"/>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader';
import PostCreatePage from '@/pages/PostCreatePage';
import PostListPage from '@/pages/PostListPage';
import {mapState, mapActions} from 'vuex';

export default {
  name: 'App',
  components: {
    'PostCreatePage': PostCreatePage,
    'PostListPage': PostListPage,
    'AppHeader': AppHeader,
  },
  async created() {
    console.log("app created!");
    await this.getUserStatus();
    // var cookieUser = await this.$Cookie.get('user');
    // var isCookie = cookieUser == JSON.stringify({}) || cookieUser == undefined || cookieUser == null ? 0 : 1;
    var isLogin = JSON.stringify(this.user) == JSON.stringify({}) ? 0 : 1;
    console.log("app - created - this.user : ", this.user);
    if(!isLogin) {
      console.log("app - created removing cookie..");
      this.$Cookie.remove('user');
    }
  },
  methods: {
    handler: function(){
      alert("페이지를 종료합니다");
      this.signoutAction;
    },
    getCurrentTime: function(){
      var current = new Date();
      var curYear = current.getFullYear();
      var curMonth = current.getMonth() + 1;
      var curDate = current.getDate();
      var curHour = current.getHours();

      var curMin = current.getMinutes();
      if(curDate < 10){
        curDate = `0${curDate}`;
      }
      if( curMin < 10){
        curMin = `0${curMin}`;
      }
      if(curHour < 10) {curHour = `0${curHour}`};
      if(curMonth < 10) {curMonth = `0${curMonth}`};

      var curTime = `${curMonth}-${curDate}-${curYear} ${curHour}:${curMin}`;
      return curTime;
    },
    emailExist: function(email){
      console.log("App => emailExist called!");
      console.log("App -> emailExist => param : ", email);
      for(var user in this.users){
        console.log("App -=> emailExist => user : ", user);
        console.log("App => emailExist -> email in users : ", this.users[parseInt(user)]["email"]);
        if(this.trim(this.users[parseInt(user)]["email"]) === this.trim(email)){
          return true;
        }
      }
      return false;
    },
    pwFetch: function(email){
      console.log("App => pwFetch called!");
      for(var user in this.users){
        if(this.trim(this.users[parseInt(user)]["email"]) === this.trim(email)){
          var result = this.trim(this.users[parseInt(user)]["password"]);
        }
      }
      return result;
    },
    trim: function(stringToTrim) {
      return stringToTrim.replace(/^\s+|\s+$/g,"");
    },
    getSigninUser: async function(){
      await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // ...
        } else {
          // User is signed out.
          // ...
        }

      });
    },
    ...mapActions(['signoutAction', 'getUserStatus']),
  },
  computed: {
    ...mapState(['posts', 'user'])
  }
}
</script>

<style>

@import '/index.css';
</style>
