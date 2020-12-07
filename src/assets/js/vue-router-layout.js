import Vue from 'vue'
/**
 * Find which layout the component should render.
 * If the component is not specified layout name, `default` is used.
 * Otherwise return undefined.
 */
function resolveLayoutName (matched) {
  var defaultName = 'default'
  var last = matched[matched.length - 1]
  if (!last) {
    return
  }
  var Component = last.components.default
  if (!Component) {
    return
  }
  var isAsync = typeof Component === 'function' && !Component.options
  if (isAsync) {
    return
  }
  return getLayoutName(Component) || defaultName
}
function getLayoutName (Component /* ComponentOptions | VueConstructor */) {
  var isCtor = typeof Component === 'function' && Component.options
  var options = isCtor ? Component.options : Component
  if (options.layout) {
    return options.layout
  } else {
    // Retrieve super component and mixins
    var mixins = (options.mixins || []).slice().reverse()
    var extend = options.extends || []
    return mixins.concat(extend).reduce(function (acc, c) {
      return acc || getLayoutName(c)
    }, undefined)
  }
}
export function createRouterLayout (resolve) {
  return Vue.extend({
    name: 'RouterLayout',
    data: function () {
      return {
        layoutName: undefined,
        layouts: Object.create(null)
      }
    },
    watch: {
      layoutName: function (name) {
        if (!this.layouts[name]) {
          this.$set(this.layouts, name, function () { return resolve(name) })
        }
      }
    },
    provide: function () {
      var _this = this
      return {
        $_routerLayout_notifyUpdate: function () {
          var matched = _this.$route.matched
          _this.layoutName = resolveLayoutName(matched) || _this.layoutName
        }
      }
    },
    beforeRouteEnter: function (to, _from, next) {
      var _this = this
      next(function (vm) {
        vm.layoutName = resolveLayoutName(to.matched) || _this.layoutName
      })
    },
    beforeRouteUpdate: function (to, _from, next) {
      this.layoutName = resolveLayoutName(to.matched) || this.layoutName
      next()
    },
    render: function (h) {
      var layout = this.layoutName && this.layouts[this.layoutName]
      if (!layout) {
        return h()
      }
      return h('keep-alive', [h(layout, {
        key: this.layoutName
      })])
    }
  })
}
Vue.mixin({
  inject: {
    $_routerLayout_notifyUpdate: {
      default: null
    }
  },
  beforeUpdate: function () {
    var notify = this.$_routerLayout_notifyUpdate
    if (notify) {
      notify()
    }
  }
})
