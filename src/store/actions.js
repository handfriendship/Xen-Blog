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
  ALGOLIA_SEARCH,
  // SET_ACCESS_TOKEN,
  // SET_MY_INFO,
  // DESTROY_ACCESS_TOKEN,
  // DESTROY_MY_INFO, FETCH_POST_LIST, FETCH_POST, UPDATE_COMMENT, DELETE_COMMENT, EDIT_COMMENT
} from './mutation-types'
import firebase from 'firebase';
import router from '../router/index.js';
import store from '@/store';
import Algolia from '@/Algolia.js';

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

var getUserStatus = function(){
  console.log("getUserStatus called!");

  return new Promise(function(resolve, reject){
    firebase.auth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged hook called!");
      console.log("onAuthStateChanged - user : ", user);
      if (user) {
        console.log("onAuthStateChanged - in if");
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;

        store.commit('WATCH_USER', {
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          photoURL: photoURL,
          isAnonymous: isAnonymous,
          uid: uid,
          providerData: providerData,
        });
        resolve();
      } else {
        console.log("onAuthStateChanged - in else");
        // reject('error-error');
      }
    })
  })
}

export default {
  async createPage ({commit}, payload) {
    console.log("actions - createPage called!");
    const {postID} = payload;
    firebase.firestore().collection('test').doc(postID).set(payload)
      .then(function(){
        console.log("beforeAlgolia payload : ", payload);
        Algolia.addSingleIndexWithId(payload)
          .then(algoliaRes => {
            console.log("algoliaRes : ", algoliaRes);
            console.log("algoliaRes - payload : ", payload);
            commit(CREATE_POST, payload);
          })
      })
      .catch(e => console.log(e))
  },
  async fetchPostList ({commit}) {
    console.log("fetchPostList actions called!");
    // const snapshot = await firebase.firestore().collection("test").get();
    // snapshot.forEach(v => {
    //   const data = v.data();
    // })

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
      Algolia.editIndexById(payload)
        .then((objectID) => {
          commit(UPDATE_POST_BY_ID, {contents: payload, postID: postID});
        })
    }).catch(function(e){
      alert(e);
    })
  },
  async deletePostByIndex({commit, state}, postIndex){
    console.log("actions - deletePostByIndex - postIndex : ", postIndex);
    const tempID = getPostID(state, postIndex);
    return firebase.firestore().collection("test").doc(tempID).delete()
      .then(function(){
        Algolia.deleteIndexById(tempID)
          .then(() => {
            console.log("actions - deletePostByIndex - in then");
            commit(DELETE_POST_BY_ID, {postId: postIndex});
          })

      })
  },
  async signupAction({commit, state}, userInfo){
    const {name, email, password} = userInfo;
    console.log("signupAction - userinfo : ", userInfo);
    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(async function(result) {
        console.log("signupAction - result : ", result);
        await result.user.updateProfile({
          displayName: name
        })
      })
      .then(() => {
        getUserStatus(commit);
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
            getUserStatus(commit);
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
            getUserStatus(commit);
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
  async signoutAction({commit, state}, currentPath){ // 꼭 질문! signoutAction 을 했는데 onAuthStateChanged 훅이 왜 호출될까 ?
    console.log("actions -> signoutAction");
    firebase.auth().signOut().then(function() {
      commit(SIGN_OUT, currentPath);
    }).catch(function(error) {
      console.log("An error happened.");
      // An error happened.
    });
  },
  async algoliaSearch({commit, state}, {keyword, picked}){
    console.log("actions -> algoliaSearch called!");
    Algolia.searchIndex({keyword, picked})
      .then(hits => {
        commit(ALGOLIA_SEARCH, hits);
      })
  },
  getUserStatus,


}
