const app = getApp();
const {
  Post,
  Get,
  Put,
  Upload
} = require('../../utils/api-request.js');
const api = require('../../config/api.js');

Page({
  data: {
    title: '发表',
    user: null,
    imgList: [],
    categoryList: [],
    chaCheList: [],
    integralList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    integral: null,
    tagIndex: null,
    textareaAValue: null,
    realUrlList: []
  },
  onLoad() {
    this.initData()
  },
  onShow() {

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  initData(){
   //初始化分类
    Get(api.Url.communityCategory,this.data.token)
    .then(res => {
        let rs = [];
        if (res.code === 0) {
            res.data.forEach(item => {
                rs.push(item.categoryName)
            })
            this.setData({
                categoryList: rs,
                chaCheList: res.data
            })
        }
    })

    Get(api.Url.getUserInfo)
      .then(res => {
        if(res.code===0){
          this.setData({
            client:res.data.client,
            user:res.data
          })
        }
      })
  },
  checkUser() {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (!res.data) {
          wx.redirectTo({
            url: '/pages/login/index',
          })
        } else {
          this.setData({
            userInfo: wx.getStorageSync("userInfo"),
            token: res.data
          })
          this.initData()
        }
      },
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  submitQuestion() {

    let integral = this.data.integralList[this.data.integral];
    if (!this.data.client) {
      wx.showToast({
        title: '用户未登录',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }

    if (!this.data.textareaAValue) {
      wx.showToast({
        title: '发布内容不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }

    if (!this.data.tagIndex) {
      wx.showToast({
        title: '请选择标签',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }

    if (!this.data.integral) {
      wx.showToast({
        title: '请选择悬赏积分',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }

    if (this.data.client.integral - integral < 0) {
      wx.showToast({
        title: '积分不足',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    } else {
      this.data.client.integral = this.data.client.integral - integral;
    }
    console.log(this.data.client)
    //发布消息
    Put(api.Url.question, {
      client: this.data.client,
      questions: {
        categoryId: this.data.chaCheList[this.data.tagIndex].id,
        content: this.data.textareaAValue,
        clientId: this.data.client.id,
        integral: integral
      },
      imgList: this.data.realUrlList
    },this.data.token).then(res => {

      if (res.code === 0) {
        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 1000,
          mask: true,
          success: () => {
            wx.navigateBack({
              delta:1
            })
          }
        })
      }
    })

  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  PickerChange(e) {
    this.setData({
      tagIndex: e.detail.value
    })
  },
  PickerChangeIntegral(e) {
    this.setData({
      integral: e.detail.value
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res)

        res.tempFilePaths.forEach(item => {
          Upload(api.Url.uploadImage, item,this.data.token)
            .then(res => {
              if (res.code === 0) {
                this.data.realUrlList.push(res.data)
                console.log(this.data.realUrlList)
              }

            })
        })

        if (this.data.imgList.length !== 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })


        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  toHome() {

    wx.switchTab({
      url: '/pages/index/index',
      success: function(e) {
        let page = getCurrentPages().pop();
        if (page === undefined || page === null) return;
        page.onLoad();
      }
    })
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    })
  }
});
