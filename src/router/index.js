import Vue from 'vue'
import Router from 'vue-router'
import AppHeader from '@/components/AppHeader'
import PostListPage from '@/pages/PostListPage'
import Signin from '@/pages/Signin'
import Signup from '@/pages/Signup'
import Create from '@/pages/PostCreatePage'
import PostEditPage from '@/pages/PostEditPage'
import PostViewPage from '@/pages/PostViewPage'
import App from '@/App'
import store from '@/store'
import Algolia from '@/Algolia.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      components: {
        header: AppHeader,
        default: PostListPage,
      },

    },
    {
      path: '/signin',
      name: 'Signin',
      components: {
        header: AppHeader,
        default: Signin,
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      components: {
        header: AppHeader,
        default: Signup,
      }
    },
    {
      path: '/post/create',
      name: 'Create',
      components: {
        header: AppHeader,
        default: Create,
      },
      // props: true,
      // meta: {
      //   requiresAuth: true,
      // }
      beforeEnter: async (to, from, next) => {
        console.log("router guard of create");

        var cookieUser = await Vue.prototype.$Cookie.get('user');
        var storeUser = store.state.user;
        var isCookie = cookieUser == JSON.stringify({}) || cookieUser == undefined || cookieUser == null ? 0 : 1;
        var isLogin = JSON.stringify(storeUser) == JSON.stringify({}) || storeUser == undefined || storeUser == null ? 0 : 1;
        console.log("isCookie : ", isCookie);
        console.log("isLogin : ", isLogin);
        console.log("cookie content : ", Vue.prototype.$Cookie.get());
        console.log("cookieUser : ", cookieUser);
        if(!isLogin && !isCookie){
          alert("로그인 후 이용하실 수 있습니다.");
          next({name: 'Signin'});
        } else {
          next();
        }

      },
    },
    {
      path: '/post/:postId/edit',
      name: 'PostEditPage',
      components: {
        header: AppHeader,
        default: PostEditPage,
      },
      props: true,
      meta: {
        requiresAuth: true,
      },
      beforeEnter: (to, from, next) => {
        next();
      }

    },
    {
      path: '/post/:postId',
      name: 'PostViewPage',
      components: {
        header: AppHeader,
        default: PostViewPage,
      },
      props: true,
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log("router.beforeEach called!");
  Algolia.searchIndex('Jim');

  next();
})

export default router;
