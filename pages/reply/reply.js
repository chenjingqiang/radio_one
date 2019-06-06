// pages/reply/reply.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    uid:'',
    userInfo:{},
    lu_sta:'1',
    show_dong:true,
    miao:1,
    sub_t:true,
    new_id:'',
    tempFilePath:'',
    xuanze:true,
    yuyin:true,
    tishi_t2:false,
    te_value:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我来翻译'
    })
    var that=this
    that.data.uid = wx.getStorageSync('openid')
    that.data.new_id = wx.getStorageSync('new_id')
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
    recorderManager.onStart(() => {
      that.setData({
        lu_sta: '2'
      })
      clearInterval(that.data.timer)
      that.setData({
        miao: 0,
        timer: setInterval(function () {
          that.setData({
            miao: that.data.miao += 1
          })
        }, 1000)
      })
    });
    innerAudioContext.onPlay(() => {
      //console.log('开始播放')
    })
    innerAudioContext.onEnded(() => {
      this.setData({
        show_dong: true
      })
    })
    recorderManager.onStop((res) => {
      clearInterval(this.data.timer)
      this.setData({
        lu_sta: '3',
        sub_t: false,
      })
      this.data.tempFilePath = res.tempFilePath;
      //console.log('停止录音', res.tempFilePath)
    })
  },
  change_xuanze: function (e) {
    if (e.currentTarget.dataset.change_type == 'mp3') {
      this.setData({
        xuanze: true,
        yuyin: true
      })
    } else {
      this.setData({
        xuanze: false,
        yuyin: false
      })
    }

  },
  //开始录音
  start: function () {
    var that = this
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
    
    innerAudioContext.onError((res) => {
      //console.log(res.errMsg)
     // console.log(res.errCode)
    })
  },
  //重新录音
  chong: function () {
    innerAudioContext.stop()
    this.data.tempFilePath = ''
    this.setData({
      lu_sta: '1',
      sub_t: true,
    })
  },
  te_change: function (e) {
      this.setData({
        te_value: e.detail.value,
        sub_t: true
      })
   
    if (this.data.te_value!=''){
      this.setData({
        sub_t: false
      })
    }
  },
  suba:function(){
    var that=this
    innerAudioContext.stop()
    if(this.data.yuyin){
      if (!this.data.sub_t) {
        var formData = {
          uid: this.data.uid,
          username: this.data.userInfo.nickName,
          img: this.data.userInfo.avatarUrl,
          sex: this.data.userInfo.gender,
          qyid: this.data.new_id,
          second: this.data.miao
        }
        var that = this
        wx.uploadFile({
          url: 'https://www.uear.net/ajax/release_reply.php',//服务器接口
          filePath: that.data.tempFilePath,
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: formData,
          success: function (dataS) {
            if (dataS.data == 1) {
              wx.setStorageSync('reply_succe', true)
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '1分钟内不能重复回复同一求译哦',
                success: function (res) {
                }
              })
            }
            //console.log('上传成功')
            // 
          },
          fail: function () {
            //console.log('接口调用失败')
          }
        })

      }
    }else{
      if (!this.data.sub_t) {
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
              var formData2 = {
                uid: that.data.uid,
                username: that.data.userInfo.nickName,
                img: that.data.userInfo.avatarUrl,
                sex: that.data.userInfo.gender,
                qyid: that.data.new_id,
                content: that.data.te_value
              }
              wx.request({
                url: 'https://www.uear.net/ajax/release_reply_text.php',
                data: formData2,
                method: 'GET',
                success: function (res) {
                  if (res.data.code == 1) {
                    wx.setStorageSync('reply_succe', true)
                    wx.navigateBack({
                      delta: 1
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '1分钟内不能重复回复同一求译哦',
                      success: function (res) {
                      }
                    })
                  }
                }
              })
             
            }else{
              that.setData({
                tishi_t2: true
              })
            }
          }
        })
        

      }
    }
  },
  onUnload: function () {
    innerAudioContext.stop()
    recorderManager.stop()
  },
})