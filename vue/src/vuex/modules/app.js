

import Vue from 'vue'

const app = {
  state: {
    cachePage: [],
    pageOpenedList: [{
      title: 'home',
      path: '',
      name: 'home',
    }],
    pageOpenedListAll:[],
    lang: localStorage.lang,
  },
  mutations: {
    removeTag(state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.query) {
          if (item.query.id === name) {
            state.pageOpenedList.splice(index, 1);
          }
        } else {
        	if (item.name === name) {
            state.pageOpenedList.splice(index, 1);
          }
        }
      });
    },
    closePage (state, name) {
      state.cachePage.forEach((item, index) => {
        if (item.query) {
          if (item.query.id === name) {
            state.cachePage.splice(index, 1);
          }
        } else {
        	if (item.name === name) {
            state.cachePage.splice(index, 1);
          }
        }
      });
    },
    clearAllTags (state) {
      state.pageOpenedList.splice(1);
      state.cachePage.length = 0;
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    clearOtherTags (state, vm) {
      let currentName = vm.$route.name;
      let currentIndex = 0;
      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index;
        }
      });
      if (currentIndex === 0) {
        state.pageOpenedList.splice(1);
      } else {
        state.pageOpenedList.splice(currentIndex + 1);
        state.pageOpenedList.splice(1, currentIndex - 1);
      }
      let newCachepage = state.cachePage.filter((item) => {
        return item === currentName;
      });
      state.cachePage = newCachepage;
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    increateTag (state, tagObj) {
      let isOpen = false
      for (let i=0;i<state.pageOpenedList.length;i++) {
        if (state.pageOpenedList[i].query) {
        	if (tagObj.query) {
        		if(state.pageOpenedList[i].query.id === tagObj.query.id) {
            	isOpen = true
          	}
        	} else {
        		if(state.pageOpenedList[i].name === tagObj.name) {
            	isOpen = true
          	}
        	}

        } else {
        	if(state.pageOpenedList[i].name === tagObj.name) {
            isOpen = true
          }
        }
      }
      if(!isOpen){
        if (state.pageOpenedList.length < 6) {
          state.pageOpenedList.push(tagObj)
        } else {
          state.pageOpenedList.splice(1, 1)
          state.pageOpenedList.push(tagObj)
        }
        localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
      }
    },
    setOpenedList (state) {
      state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : state.pageOpenedList;
    },
    setLang (state, param) {
      state.lang = param
      Vue.config.lang = param
      localStorage.lang = state.lang
    },
  }
};

export default app;
