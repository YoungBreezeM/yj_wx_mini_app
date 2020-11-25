//index.js
//获取应用实例
const app = getApp()
const shake = require('../../utils/shake.js');
const createGua = require('../../utils/bugua.js');
const api = require('../../config/api.js');
const {
  Post,
  Get
} = require('../../utils/api-request.js');

var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    show: false,
    top: "",
    bottom: "",
    gua: ["乾", "坎", "艮", "震", "巽", "离", "坤", "兑"],
    guaGraph: [
      [1, 1, 1],
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [0, 0, 0],
      [0, 1, 1]
    ],
    cacheGuaTop: [],
    cacheGuaBottom: [],
    cacheGuaList: [],
    cacheGua: [],
    time: null,
    navHeight: null,
    status: true,
    baseGua: null,
    yao: null,
    prediction: null,
    cachePredicitionCategory: [],
    preShow: false
  },
  onLoad: function() {
    console.log("bugua")
    this.resize(); //开启摇一摇
    this.setData({
      navHeight: app.globalData.navHeight
    });

    // 设置本页中自定义tabBar
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  resolveGua(){
    let that = this;
    if(this.data.yao){
      Post(api.Url.prediction, {
        baseGuaId: this.data.baseGua.id,
        categoryId: this.data.prediction.id,
        yaoId: this.data.yao.id
      }).then(res => {
        if(res.code == 0){
          WxParse.wxParse('predictionText', 'html', res.data.predictionText, that, 5);
        }
      })
    }else{
      Post(api.Url.prediction, {
        baseId: this.data.baseGua.id,
        categoryId: this.data.prediction.id,
        yaoId: null
      }).then(res => {
        if(res.code==0){
          WxParse.wxParse('predictionText', 'html', res.data.predictionText, that, 5);
        }
      })
    }
    
  },
  onCategoryChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;

    this.setData({
      prediction:this.data.cachePredicitionCategory[index]
    })
   
  },
  changeCategory(){
    this.getPredictionCategory();
    this.setData({
      preShow:true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onClosePre() {
    this.setData({
      preShow: false
    });
  },
  toDetail() {
    console.log(this.data.baseGua)
    let that = this;
    if (this.data.baseGua) {
      WxParse.wxParse('guaText', 'html', this.data.baseGua.guaText, that, 5);
    }

    if (this.data.yao) {
      WxParse.wxParse('yaoText', 'html', this.data.yao.yaoText, this, 5);
    }

    this.setData({
      show: true
    });
  },
  onChange(event) {
    console.log(event.detail.name)
    if (event.detail.name == 2) {
      
    }
  },
  resize() {
    this.data.status = true;
    this.setData({
      top: null,
      bottom: null,
      yao: null,
      prediction: null,
      baseGua: null,
      predictionText:null,
      cacheGuaTop: [],
      cacheGuaBottom: [],
      cacheGuaList: [],
      cacheGua: [],
      predictionCategory: []
    })

    shake.openShakeEvent(); //打开摇一摇功能
    this.onAccelerometerChange(); //开启摇一摇
  },
  onShow: function() {
    console.log(this.data.status)
    if (this.data.status) {
      this.resize();
    }
  },
  onReady: function() {

  },
  getPredictionCategory() {
    Get(api.Url.predictionCategory)
      .then(res => {
        console.log(res)
        if (res.code === 0) {
          let rs = [];
          res.data.forEach(item => {
            rs.push(item.categoryName)
          })
          this.setData({
            cachePredicitionCategory: res.data,
            predictionCategory: rs
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

    wx.offAccelerometerChange() //取消监听加速度数据事件,如果没有取消监听，退出页面后摇一摇事件会继续执行
    shake.closeShakeEvent() //关闭摇一摇功能
    console.log("end")
  },

  playSound(src) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    //这两句话话一定要在一起，不然ios手机上会有时间放不出声音
    innerAudioContext.src = src
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    });
    innerAudioContext.onError((res) => {
      console.log(res)
    })
  },
  // 开启摇一摇
  onAccelerometerChange() {
    let count = 0;
    wx.onAccelerometerChange((acceleration) => {
      shake.shake(acceleration, () => {
        // 摇一摇成功后执行代码
        count++;
        this.playSound('/static/audio/coin.mp3');
        let oneGua = createGua.createdOneGua();

        this.data.cacheGuaList.unshift(oneGua.Type);
        this.data.cacheGua.unshift(oneGua.TF);

        if (this.data.cacheGuaBottom.length < 3) {
          this.data.cacheGuaBottom.unshift(oneGua.TF);
        } else {
          this.data.cacheGuaTop.unshift(oneGua.TF)
        }
        if (count > 5) {
          console.log(this.data.cacheGuaTop, this.data.cacheGuaBottom);

          this.data.guaGraph.forEach((item, index) => {
            if (item.toString() === this.data.cacheGuaTop.toString()) {
              this.data.top = index;
            }

            if (item.toString() === this.data.cacheGuaBottom.toString()) {
              this.data.bottom = index;
            }
          });

          this.drawLots();
          this.data.status = false;
          count = 0;
          shake.shakeOk();
          wx.offAccelerometerChange();
        }
        //摇一摇成功后调用后台接口获取中奖信息

      });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("hide")
    this.data.status = true;
    shake.closeShakeEvent() //关闭摇一摇功能
  },
  //抽签
  drawLots() {
    if (this.data.top == null ||this.data.bottom==null){
         this.resize();
    }

    this.setData({
      top: this.data.top,
      bottom: this.data.bottom
    });

    Post(api.Url.computeGua, {
      top: this.data.guaGraph[this.data.top],
      bottom: this.data.guaGraph[this.data.bottom],
      changeGua: this.data.cacheGuaList
    }).then(res => {
      if (res.code == 0) {
        console.log(res)
        this.setData({
          baseGua: res.data.baseGua
        })

        if (res.data.yao) {
          this.setData({
            yao: res.data.yao
          })
        }
      }
    })

    console.log(this.data.cacheGua);
    console.log(this.data.cacheGuaList)


  }

});