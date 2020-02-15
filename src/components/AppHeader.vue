<template>
  <div class="app-header">
    <h1 @click="homeBtn">Xen Media</h1>
    <div v-if="JSON.stringify(user) !== JSON.stringify({})">
      <strong>
        <button @click="toggle">{{ user.displayName }} 님 환영합니다.
          <i v-if="!isActive" class="fas fa-sort-down"></i>
          <i v-else class="fas fa-sort-up"></i>
        </button>
      </strong>
      <ul v-if="isActive">
        <li><button @click="signout">로그아웃</button></li>
      </ul>
    </div>
    <div v-else>
      <router-link :to="{ name: 'Signin' }">로그인</router-link>
    </div>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="#">Link 1</a>
      <a class="dropdown-item" href="#">Link 2</a>
      <a class="dropdown-item" href="#">Link 3</a>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';

export default {
  name: 'AppHeader',
  data() {
    return {
      isActive: false,
    }
  },
  props: {

  },

  methods: {
    signout: function(){
      alert("로그아웃 되었습니다.");
      this.signoutAction();
      this.isActive = false;
    },
    toggle: function(){
      this.isActive = !this.isActive;
    },
    homeBtn: function(){
      if(this.$route.path === '/'){
        location.reload();
      }
      this.$router.push({name: 'main'});
    },
    ...mapActions(['signoutAction']),
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<style>

</style>
