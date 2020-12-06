//获取应用实例
const app = getApp();

const {
  Post,
  Get,
  Put,
  Delete,
  Upload
} = require('../../../utils/api-request.js');
const api = require('../../../config/api.js');
Page({
  data: {
    isComment: false,
    show:false,
    noContentImage: api.ImageServer.noContentImage,
    questionAnswers: null,
    host: api.ApiBaseUrl,
    client: {
      nickName: '',
      avatarUrl: ''
    },
    questionId: null,
    client: null,
    imgList: [],
    categoryList: [],
    chaCheList: [],
    integralList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    integral: null,
    tagIndex: null,
    textareaAValue: null,
    realUrlList: [],
    host:api.ApiBaseUrl
  },
  onLoad(e) {
    console.log(e)
    if (e.questionId) {
      this.setData({
        questionId: e.questionId
      })
      this.getQuestionAnswer(e.questionId)

      this.checkUser();
    }
  },
  checkUser() {
    let userInfo = wx.getStorageSync("userInfo");

    //初始用户信息
    Get(api.Url.getUserInfo)
      .then(res => {
        if (res.code === 0) {
          if (userInfo) {
            this.setData({
              userInfo: userInfo
            })
          } else {
            this.setData({
              modalName: "DialogModal"
            })
          }

          res.data.nickName = userInfo.nickName;
          res.data.avatarUrl = userInfo.avatarUrl;

          this.setData({
            client: res.data,
          })

          //初始化分类
          Get(api.Url.communityCategory)
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

        }
      })
  },
  getQuestionAnswer(questionId) {
    Get(api.Url.getQuestionAnswers + questionId)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          this.setData({
            questionAnswers: res.data,
          })

        }
      })
  },
  toDeleteQuestion(){
    wx.showModal({
      title: '提示',
      content: '确定要删除该问题吗？',
      success: (sm)=> {
        if (sm.confirm) {
           Delete(api.Url.question+"/"+this.data.questionId)
           .then(res=>{
             if(res.code===0){
               wx.navigateBack({
                 delta: 1
               })
             }
           })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onClose(){
    this.setData({
      show:false
    })
  },
  toEdit(){
    this.setData({
      show:true
    })
    let { imgList,questions } = this.data.questionAnswers.questionClient;

    console.log(this.data.chaCheList)
    for (let i = 0; i < this.data.chaCheList.length;i++){
      if(this.data.chaCheList[i].id===questions.categoryId){
        this.setData({
          tagIndex:i
        })
        break;
      }
    }
    this.setData({
      imgList:imgList,
      textareaAValue:questions.content,
      integral:questions.integral-1
    })
    console.log(imgList)
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
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
          Upload(api.Url.uploadImage, item, this.data.token)
            .then(res => {
              if (res.code === 0) {
                this.data.imgList.push(res.data)
                console.log(this.data.imgList)
                this.setData({
                  imgList:this.data.imgList
                })
              }

            })
        })
      }
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这照片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          Delete(api.Url.wxImage,{
            url: this.data.imgList[e.currentTarget.dataset.index]
          }).then(res=>{
            if(res.code===0){
              this.data.imgList.splice(e.currentTarget.dataset.index, 1);
              this.setData({
                imgList: this.data.imgList
              })
            }
          })
        }
      }
    })
  },
  submitQuestion() {
    console.log(this.data.integral)
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

    if (this.data.textareaAValue==null) {
      wx.showToast({
        title: '发布内容不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }

    if (this.data.tagIndex==null) {
      wx.showToast({
        title: '请选择标签',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }

    if (this.data.integral==null) {
      wx.showToast({
        title: '请选择悬赏积分',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }

    if (this.data.client.integral - integral <= 0) {
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
    Post(api.Url.question, {
      client: this.data.client,
      questions: {
        id: this.data.questionAnswers.questionClient.questions.id,
        categoryId: this.data.chaCheList[this.data.tagIndex].id,
        content: this.data.textareaAValue,
        clientId: this.data.client.id,
        integral: integral
      },
      imgList: this.data.imgList
    }, this.data.token).then(res => {

      if (res.code === 0) {
        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 1000,
          mask: true,
          success: () => {
            this.getQuestionAnswer(this.data.questionId)
            this.setData({
              show:false
            })
          }
        })
      }
    })

  },
});
