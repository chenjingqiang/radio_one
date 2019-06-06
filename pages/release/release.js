// pages/release/release.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    tempFilePath: '',
    t_length: 0,
    show:true,
    sub_t:true,
    miao:1,
    lu_sta:'1',
    timer:'',
    input_value:'',
    te_value: '',
    openid:'',
    nickname:'',
    img_url:'',
    sex:'',
    show_dong:true,
    fabu:true,
    tishi_t:false,
    tishi_t2:false,
    xuanze:true,
    yuyin:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this
    var openid = wx.getStorageSync('openid') || ''
    that.setData({
      openid: openid
    })
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickname: res.userInfo.nickName,
          img_url: res.userInfo.avatarUrl,
          sex: res.userInfo.gender,
        })
      }
    })
    wx.setNavigationBarTitle({
      title: '一句求译'
    })
    recorderManager.onStart(() => {
      that.setData({
        lu_sta: '2'
      })
      clearInterval(that.data.timer)
      that.setData({
        miao: 1,
        timer: setInterval(function () {
          that.setData({
            miao: that.data.miao += 1
          })
        }, 1000)
      })
      // var timer=null
      // clearTimeout(timer)
      // timer = setTimeout(function () {
      //   const recorderManager = wx.getRecorderManager()
      //   const innerAudioContext = wx.createInnerAudioContext()
      //   recorderManager.stop();
      //   recorderManager.onStop((res) => {
      //     that.tempFilePath = res.tempFilePath;
      //     console.log('停止录音', res.tempFilePath)
      //     clearInterval(timer2)
      //   })
      // }, 10000)
    });
    recorderManager.onStop((res) => {
      clearInterval(this.data.timer)
      this.setData({
        lu_sta: '3',
        show: false,
      })
      if (this.data.input_value != '') {
        this.setData({
          sub_t: false
        })
      }
      this.data.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
    })
    innerAudioContext.onEnded(() => {
      this.setData({
        show_dong: true
      })
    })
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      t_length: t_text
    })
  },
  //开始录音
  start: function () {
    var that=this
    //开始录音 
    const options = {
      //duration:5000,
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    //错误回调
    recorderManager.onError((res) => {
      //console.log(res);
    })
  },
  //停止录音
  stop: function () {
    recorderManager.stop();
  },
  //播放录音
  play: function () {
    this.setData({
      show_dong: false
    })
    innerAudioContext.src = this.data.tempFilePath,
    innerAudioContext.autoplay = true
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      //console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  //重新录音
  chong:function(){
    innerAudioContext.stop()
    this.data.tempFilePath = ''
    this.setData({
      lu_sta: '1',
      sub_t: true,
      show:true
    })
  },
  change:function(e){
    this.setData({
      input_value: e.detail.value,
      sub_t: true
    })
    if (this.data.input_value != '' && this.data.tempFilePath !='' ){
      this.setData({
        sub_t: false
      })
    }
    if (this.data.input_value != '' && this.data.te_value != '') {
      this.setData({
        sub_t: false
      })
    }
  },
  te_change:function(e){
    this.setData({
      te_value: e.detail.value,
      sub_t: true
    })
    if (this.data.input_value != '' && this.data.te_value != '') {
      this.setData({
        sub_t: false
      })
    }
  },
  change_xuanze:function(e){
    if (e.currentTarget.dataset.change_type=='mp3'){
      this.setData({
        xuanze: true,
        yuyin: true
      })
    }else{
      this.setData({
        xuanze: false,
        yuyin: false
      })
    }
    
  },
  suba:function(){
    var that=this
    //console.log(this)
    //console.log(this.data.input_value)
    //console.log(this.data.tempFilePath)
    innerAudioContext.stop()
    if (that.data.xuanze){
        var formData = {
          uid: this.data.openid,
          username: this.data.nickname,
          img: this.data.img_url,
          sex: this.data.sex,
          title: this.data.input_value,
          second: this.data.miao
        }
        if (!that.data.sub_t) {
          wx.request({
            url: 'https://www.uear.net/ajax/title_check.php',
            data: {
              title: that.data.input_value,
            },
            method: 'GET',
            success: function (res) {
              if (res.data.code == 1) {
                that.setData({
                  fabu: false,
                  tishi_t: false
                })
                wx.uploadFile({
                  url: 'https://www.uear.net/ajax/release_qiuyi.php',//服务器接口
                  filePath: that.data.tempFilePath,
                  name: 'file',
                  header: {
                    "Content-Type": "multipart/form-data"
                  },
                  formData: formData,
                  success: function (data) {
                    that.setData({
                      fabu: false
                    })
                    wx.setStorageSync('succe', true)
                    wx.navigateBack({
                      delta: 1
                    })
                  },
                  fail: function () {
                  }
                })
              } else {
                that.setData({
                  tishi_t: true
                })
              }
            }
          })

        }    
    }else{
      var formData2 = {
        uid: this.data.openid,
        username: this.data.nickname,
        img: this.data.img_url,
        sex: this.data.sex,
        title: this.data.input_value,
        content: this.data.te_value,
      }
     if (!that.data.sub_t) {
       wx.request({
         url: 'https://www.uear.net/ajax/title_check.php',
         data: {
           title: that.data.input_value,
         },
         method: 'GET',
         success: function (res) {
           if (res.data.code == 1) {
             that.setData({
               tishi_t: false
             })
             wx.request({
               url: 'https://www.uear.net/ajax/title_check.php',
               data: {
                 title: that.data.te_value,
               },
               method: 'GET',
               success: function (res) {
                 if (res.data.code == 1) {
                   that.setData({
                     tishi_t2: false
                   })
                   wx.request({
                     url: 'https://www.uear.net/ajax/release_qiuyi_text.php',
                     data: formData2,
                     method: 'GET',
                     success: function (res) {
                       that.setData({
                         fabu: false
                       })
                       wx.setStorageSync('succe', true)
                       wx.navigateBack({
                         delta: 1
                       })
                     }
                   })
                 }else{
                   that.setData({
                     tishi_t2: true
                   })
                 }
               }
             })
           } else {
             that.setData({
               tishi_t: true
             })
           }
         }
       })
       
        // wx.request({
        //   url: 'https://www.uear.net/ajax/message_data.php',
        //   data: {
        //     uid: that.data.uid,
        //   },
        //   method: 'GET',
        //   success: function (res) {
        //     console.log(res)
        //   },
        // })
      }
    }
  },
  onUnload: function () {
    innerAudioContext.stop()
    recorderManager.stop()
  },

})