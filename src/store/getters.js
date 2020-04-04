import Vue from 'vue';
// import store from '@/store';

var detectFlag = function(arr){
  var tempArr = arr.filter(post => {
    return post['flag'] == '2';
  })
  tempArr.map(post => {
    delete post.flag;
  })
  return tempArr;
}

export default {
  isAuthorized (state) {
    return state.accessToken.length > 0 && !!state.me
  },
  refinedSearched (state) {
    return picked => {
      var ignore = ['objectID', '_highlightResult'];
      var category = picked;
      if(category == 'title,content'){
        var category = picked.split(',');
      }
      return detectFlag(state.searched.map(post => {
        var tempObj = {};
        for(let element in post){ // element = title or content or author or curTime or postID or ..
          if((element == category || category.includes(element)) && post._highlightResult[element].matchLevel != 'none') {
            tempObj['flag'] = '2';
            tempObj[element] = post._highlightResult[element].value;
          }
          else if(!ignore.includes(element)){
            tempObj[element] = post[element];
          }
        }
        return tempObj;
      }))
    }
    // console.log("state.posts : ", state.posts);
    // console.log("result : ", result);
    // return result;
  },
  testGetter (state) {
    return state.user;
  }
}
