// import api from '@/api'
import {
  CREATE_POST,
  FETCH_POST_LIST,
  FETCH_POST_BY_INDEX,
  GET_POST_BY_INDEX,
  UPDATE_POST_BY_ID,
  DELETE_POST_BY_ID,
  SIGN_IN,
  SIGN_OUT,
  // SET_ACCESS_TOKEN,
  // SET_MY_INFO,
  // DESTROY_ACCESS_TOKEN,
  // DESTROY_MY_INFO, FETCH_POST_LIST, FETCH_POST, UPDATE_COMMENT, DELETE_COMMENT, EDIT_COMMENT
} from './mutation-types'
import firebase from 'firebase';
import router from '../router/index.js';

// var testRef = firebase.firestore().collection("test");
var getPostID = function(state, postIndex){
  var targetElement = "";
  state.posts.forEach((element, index, array) => {
    if(index === parseInt(postIndex)) {
      targetElement = element.postID;
    }
  })
  return targetElement;
}

export default {
  createPage ({commit}, payload) {
    const {postID} = payload;
    firebase.firestore().collection('test').doc(postID).set(payload)
      .then(r => {
        console.log(r);
        commit(CREATE_POST, r.data);
      })
      .catch(e => console.log(e))
  },
  async fetchPostList ({commit}) {
    console.log("fetchPostList actions called!");
    const snapshot = await firebase.firestore().collection("test").get();
    snapshot.forEach(v => {
      const data = v.data();
    })

    return firebase.firestore().collection("test").get()
      .then(snapshot => {
        commit(FETCH_POST_LIST, snapshot)
      })
  },
  async fetchPostByIndex ({commit, state}, postIndex) {
    console.log("fetchPostBYINdex called!");
    if(state.posts.length){
      commit(GET_POST_BY_INDEX, state.posts[postIndex]);
    } else {
      firebase.firestore().collection("test").get()
        .then(snapshot => {
          commit(FETCH_POST_LIST, snapshot);
          // commit(FETCH_POST_BY_INDEX, {snapshot: snapshot, postIndex: postIndex});
        })
        .then(function(){
          commit(GET_POST_BY_INDEX, state.posts[postIndex]);
        })
    }
    return false;

  },
  async editPostByID({commit, state}, payload) {
    console.log("editPostBYID called!");
    var {title, content, postID, curTime} = payload;
    return firebase.firestore().collection("test").doc(postID).update({
      content: content,
      title: title,
      curTime: curTime,
    }).then(function(){
      commit(UPDATE_POST_BY_ID, {contents: payload, postID: postID});
    }).catch(function(e){
      alert(e);
    })
  },
  async deletePostByIndex({commit, state}, postIndex){
    const tempID = getPostID(state, postIndex);
    return firebase.firestore().collection("test").doc(tempID).delete().then(function(){
      commit(DELETE_POST_BY_ID, {postId: postIndex});
    })
  },
  async signupAction({commit, state}, userInfo){
    const {name, email, password} = userInfo;
    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(result) {
        return result.user.updateProfile({
          displayName: name
        })
      })
      .then(function(result) {
        router.push({name: 'main'});
      })
      .catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
      })
  },
  async signupWithGoogle({commit, state}){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().languageCode = 'ko';
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function() {

        return firebase.auth().signInWithPopup(provider)
          .then(function(result){
            var token = result.credential.accessToken;
            var user = result.user;
            console.log("token : ", token);
            console.log("user : ", user);
            commit(SIGN_IN);
          }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
          });
      })
      .catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;
      });
  },
  async signinAction({commit, state}, userInfo){
    console.log("actions -> signinAction");
    const {email, password} = userInfo;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function() {

        return firebase.auth().signInWithEmailAndPassword(email, password)
          .then(function(result) {
            commit(SIGN_IN);
          })
          .catch(function(error) {
            alert(error);
          })
      })
      .catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;
      });
  },
  async signoutAction({commit, state}){
    console.log("actions -> signoutAction");
    firebase.auth().signOut().then(function() {
      console.log("Sign-out successful.");
      commit(SIGN_OUT);
      // Sign-out successful.
    }).catch(function(error) {
      console.log("An error happened.");
      // An error happened.
    });

  }
  // signin ({ commit }, payload) {
  //   return api.post('/auth/signin', {
  //     email: payload.email,
  //     password: payload.password
  //   }).then(res => {
  //     const { accessToken } = res.data
  //     commit(SET_ACCESS_TOKEN, accessToken)
  //     return api.get('/users/me')
  //   }).then(res => {
  //     commit(SET_MY_INFO, res.data)
  //   })
  // },
  // signout ({ commit }) {
  //   commit(DESTROY_MY_INFO)
  //   commit(DESTROY_ACCESS_TOKEN)
  // },
  // signinByToken ({ commit }, token) {
  //   commit(SET_ACCESS_TOKEN, token)
  //   return api.get('/users/me')
  //     .then(res => {
  //       commit(SET_MY_INFO, res.data)
  //     })
  // },
  // fetchPostList ({ commit }) {
  //   return api.get('/posts')
  //     .then(res => {
  //       commit(FETCH_POST_LIST, res.data)
  //     })
  // },
  // fetchPost ({ commit }, postId) {
  //   return api.get(`/posts/${postId}`)
  //     .then(res => {
  //       commit(FETCH_POST, res.data)
  //     })
  // },
  // createComment ({ commit, state }, comment) {
  //   const postId = state.post.id
  //   return api.post(`/posts/${postId}/comments`, { contents: comment })
  //     .then(res => {
  //       commit(UPDATE_COMMENT, res.data)
  //     })
  // },
  // deleteComment ({ commit, state }, commentId) {
  //   const postId = state.post.id
  //   return api.delete(`/posts/${postId}/comments/${commentId}`)
  //     .then(res => {
  //       commit(DELETE_COMMENT, commentId)
  //     })
  // },
  // editComment ({ commit, state }, { commentId, comment }) {
  //   const postId = state.post.id
  //   return api.put(`/posts/${postId}/comments/${commentId}`, { contents: comment })
  //     .then(res => {
  //       commit(EDIT_COMMENT, res.data)
  //     })
  // }
}
