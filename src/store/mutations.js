import {
  FETCH_POST,
  SET_ACCESS_TOKEN,
  SET_MY_INFO,
  DESTROY_ACCESS_TOKEN,
  DESTROY_MY_INFO,

  UPDATE_COMMENT,
  DELETE_COMMENT,
  EDIT_COMMENT,

  CREATE_POST,
  FETCH_POST_LIST,
  FETCH_POST_BY_INDEX,
  GET_POST_BY_INDEX,
  UPDATE_POST_BY_ID,
  DELETE_POST_BY_ID,
  SIGN_IN,
  WATCH_USER,
  SIGN_OUT,
  ALGOLIA_SEARCH,
  REFINED_SEARCHED,
} from './mutation-types'
import router from '../router/index.js';
import Vue from 'vue';
// import api from '@/api'
// import Cookies from 'js-cookie'
var sortPosts = function(state){
  // state.posts.forEach((element, index, array) => {
  //   var temp = element.curTime.split('-').join('').split(' ').join('').split(':').join('');
  //   element['temp'] = temp;
  // })
  // state.posts.sort(function(a, b){
  //   return a.temp < b.temp ? 1 : a.temp > b.temp ? -1 : 0 ;
  // })
  // state.posts.forEach((element, index, array) => {
  //   delete element.temp;
  // })
  state.posts.sort(function(a, b){
    return a.postID < b.postID ? 1 : a.postID > b.postID ? -1 : 0 ;
  })

}

export default {
  [SET_ACCESS_TOKEN] (state, accessToken) {
    if (accessToken) { // 방어코드
      state.accessToken = accessToken
      // 설명 필요
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
      Cookies.set('accessToken', accessToken, { expires: 1 })
    }
  },
  [SET_MY_INFO] (state, me) {
    if (me) {
      state.me = me
    }
  },
  [DESTROY_ACCESS_TOKEN] (state) {
    state.accessToken = ''
    delete api.defaults.headers.common.Authorization
    Cookies.remove('accessToken')
  },
  [DESTROY_MY_INFO] (state) {
    state.me = null
  },
  [FETCH_POST] (state, post) {
    state.post = post
  },
  [UPDATE_COMMENT] (state, payload) {
    state.post.comments.push(payload)
  },
  [DELETE_COMMENT] (state, commentId) {
    const targetIndex = state.post.comments.findIndex(comment => comment.id === commentId)
    state.post.comments.splice(targetIndex, 1)
  },
  [EDIT_COMMENT] (state, payload) {
    const { id: commentId, contents, updatedAt } = payload
    const targetComment = state.post.comments.find(comment => comment.id === commentId)
    targetComment.contents = contents
    targetComment.updatedAt = updatedAt
  },
  [CREATE_POST] (state, payload) {
    console.log("create page mutations claled ");
  },
  [FETCH_POST_LIST] (state, snapshot) {
    console.log("create page mutations claled ");
    state.posts = [];
    snapshot.forEach(v => {
      var tempData = v.data();
      var newData = {...tempData, postID: v.id};
      state.posts.push(newData);
    })
    sortPosts(state);
  },
  [FETCH_POST_BY_INDEX] (state, payload) {
    console.log("Mutations - FETCH_POST_BY_INDEX");
    var {snapshot, postIndex} = payload;
    console.log("postIndex : ", postIndex);
    var targetPost;
    var iteration = 0;

    // console.log("snapshot[postIndex].data() : ", snapshot[postIndex].data());
    snapshot.forEach((element, index, array) => {
      console.log("element : ", element.data());
      if(postIndex == iteration){
        targetPost = element.data();
      }
      iteration++;
    })
    state.curPost = { ...targetPost};
    console.log("mutations - FETCH_POST_BY_INDE state.curPost : ", state.curPost);
  },
  [GET_POST_BY_INDEX] (state, payload){
    console.log("payload : ", payload);
    state.curPost = {...payload};
    console.log("curPost : ", state.curPost);
  },
  [UPDATE_POST_BY_ID] (state, payload){ // 라우터 가드를 통해 url로 바로 접근하지 못하도록 막아야함.(state.posts가 있다는 전제 하에 진행. )
    console.log("Mutations - UPDATE_POST_BY_ID");
    var {contents, postID, postId} = payload;
    console.log("postId : ", contents.postId);
    var targetIndex;
    state.posts.forEach((element, index, array) => {
      if(element.postID === postID){
        targetIndex = index;
      }
    })
    // var tempElement = {...state.posts[targetIndex], title: contents.title, content: contents.content, curTime: contents.curTime};
    var tempElement = {...state.posts[targetIndex], title: contents.title, content: contents.content};
    state.posts.splice(targetIndex, 1, tempElement);
    console.log("mutations - FETCH_POST_LIST state.posts : ", state.posts);
    router.push({name: 'PostViewPage', params: {postId: contents.postId, postID: postID} });
  },
  [DELETE_POST_BY_ID] (state, postIndex){
    console.log("Mutations - DELETE_POST_BY_ID");
    state.posts.splice(postIndex, 1);
    router.push({name: 'main' });
  },
  [SIGN_IN] () {
    alert("로그인 되었습니다.");
    router.push({name: 'main'});
  },
  [WATCH_USER] (state, loginInfo){
    console.log("Mutations - Watch_user called!");

    var {displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData} = loginInfo;
    state.user = {
      displayName: displayName,
      email: email,
      emailVerified: emailVerified,
      photoURL: photoURL,
      isAnonymous: isAnonymous,
      uid: uid,
      providerData: providerData
    }
    Vue.prototype.$Cookie.set('user', state.user);
    console.log("Mutations - Vue.prototype.$Cookie.get : ", Vue.prototype.$Cookie.get());
  },
  [SIGN_OUT] (state, currentPath){
    console.log("Mutations - sign_out called!");
    state.user = null;
    Vue.prototype.$Cookie.remove('user');

    if(currentPath !== '/'){
      router.push({name: 'main'});
    }
  },
  [ALGOLIA_SEARCH] (state, hits){
    console.log("Mutations - algolia_search called!");
    // var highlightResult = hits.map((element) => { // 여기서 highlight 에 comments 가 포함되어있지 않음
    //   return element._highlightResult;
    // })
    state.searched = hits;
  },
  [REFINED_SEARCHED] (state, picked){
    console.log("Mutations - refined_searched - picked : ", picked);
    var result = state.searched.map(post => {
      var tempObj = {};
      for(let element in post){
        tempObj[element] = post[element].value;
      }
      return tempObj;
    })
    return result;
  },
}
