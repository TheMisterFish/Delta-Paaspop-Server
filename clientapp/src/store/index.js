import Vue from 'vue'
import Vuex from 'vuex'

import AuthStore from './AuthStore'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        AuthStore: AuthStore
    }
})