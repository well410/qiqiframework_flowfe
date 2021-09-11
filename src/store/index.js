import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import subAppUrl from './modules/sub-app-urls'
import tagsView from './modules/tagsView'
import getters from './getters'
import message from './modules/message'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    app,
    user,
    subAppUrl,
    tagsView,
    message,
  },
  getters
})

export default store


