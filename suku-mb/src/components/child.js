export default {
  name : "Child",
  props : {
    myData: Array
  },
  computed : {
    msg() {
      return this
        .myData
        .join(",")
    }
  },
  render : function (createElement) {
    return createElement('div', {
      style: {
        color: 'red',
        fontSize: '18px'
      },
      attrs: {
        id: 'my-data'
      },
      on: {
        click: this.handleClick
      }
    }, this.show)
  },
  methods : {
    handleClick: function () {
      console.log(' I am dom! ');
    }
  },
  data() {
    return {
      show: 'dom',
      test: {
        attr: {
          id: 'test'
        }
      }
    }
  }
}