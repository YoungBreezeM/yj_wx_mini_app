// components/message-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    client: {
      type: Object,
      default: ''
    },
    question: {
      type: Object,
      default: ""
    },
    answer:{
      type: Object,
      default: ""
    },
    url:{
      type: String,
      default: ""
    },
    status:{
      type: Boolean,
      default: true
    },
    isCard:{
      type:Boolean,
      default:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetails(e){
      wx.navigateTo({
        url: '/pages/details/index?questionId=' + e.currentTarget.dataset.id,
      })
    }
  }
})
