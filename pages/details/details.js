// pages/details/details.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    new_id:'',
    status:'',
    name:'',
    url:'',
    time:'',
    content:'',
    li_content:'',
    title:'',
    sex:'',
    miao:'',
    del:false,
    dong:true,
    select:[],
    kong:false,
    act:true,
    new_hot:'',
    zan_sta:true,
    zan_text:0,
    type:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this
    wx.setNavigationBarTitle({
      title:'求译详情'
    })
    innerAudioContext.onPlay(() => {
      //console.log('开始播放')
    })
    innerAudioContext.onStop(() => {
      //console.log('手动停止')
      var select_for = this.data.select
      for (var i = 0; i < select_for.length; i++) {
        select_for[i].li = true
      }
      this.setData({
        dong: true,
        select: select_for
      })
    })
    innerAudioContext.onEnded(() => {
      //console.log('自动停止')
      var select_for = this.data.select
      for (var i = 0; i < select_for.length; i++) {
        select_for[i].li = true
      }
      this.setData({
        dong: true,
        select: select_for
      })
    })
  },
  play: function () {
    if (this.data.dong) {
      var select_for = this.data.select
      for (var i = 0; i < select_for.length; i++) {
        select_for[i].li = true
      }
      this.setData({
        dong: false,
        select: select_for
      })
      innerAudioContext.src = this.data.content,
        innerAudioContext.autoplay = true
      innerAudioContext.play()
      innerAudioContext.onError((res) => {
        //console.log(res.errMsg)
        //console.log(res.errCode)
      })
    }
    
    
  },
  li_play: function (e) {
    //console.log(e.currentTarget.dataset)
    if (e.currentTarget.dataset.li==true) {
      var select_for = this.data.select
      for (var i = 0; i < select_for.length;i++){
        select_for[i].li=true
      }
      select_for[e.currentTarget.dataset.index].li = ! e.currentTarget.dataset.li
      this.setData({
        dong: true,
        select: select_for
      })
      innerAudioContext.src = e.currentTarget.dataset.reply_content
      innerAudioContext.autoplay = true
      innerAudioContext.play()
      innerAudioContext.onError((res) => {
        //console.log(res.errMsg)
        //console.log(res.errCode)
      })
    }
  },
  shanchu:function(){
    innerAudioContext.stop()
    var that=this
    wx.showModal({
      title: '提示',
      content: '确定删除您的求译吗？',
      success: function (res) {
        if(res.confirm) {
          wx.request({
            url: 'https://www.uear.net/ajax/del_qiuyi.php',
            data: {
              id: that.data.new_id
            },
            method: 'GET',
            success: function (res) {
              wx.setStorageSync('shanchu_succe', true)
              wx.navigateBack({
                delta: 1
              })
              // wx.redirectTo({
              //   url: '../index/index',
              // })
            },
          })
        }
      }
    })
  },
  l_shanchu: function (e) {
    innerAudioContext.stop()
    var that=this
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除您的翻译吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.uear.net/ajax/del_reply.php',
            data: {
              reply_id: e.currentTarget.dataset.reply_id
            },
            method: 'GET',
            success: function (res) {
              wx.setStorageSync('l_shanchu_succe', true)
              that.onShow()
            },
          })
        }
      }
    })
  },
  bindtap_reply: function () {
    wx.navigateTo({
      url: "../reply/reply"
    })
  },
  onShow: function () {
    innerAudioContext.stop()
    var that=this
    that.setData({
      kong: false,
      select:[]
    })
    that.data.new_id = wx.getStorageSync('new_id')
    var uid = wx.getStorageSync('openid')
    that.data.status = wx.getStorageSync('status')
    wx.request({
      url: 'https://www.uear.net/ajax/info_qiuyi.php',
      data: {
        id: that.data.new_id,
        uid: uid
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          name: res.data.username,
          time: res.data.datetime,
          url: res.data.img,
          content: res.data.content,
          sex: res.data.sex,
          title: res.data.title,
          miao: res.data.second,
          del: res.data.del,
          type: res.data.type
        })
      },
    })
    wx.request({
      url: 'https://www.uear.net/ajax/info_reply.php',
      data: {
        id: that.data.new_id,
        uid: uid
      },
      method: 'GET',
      success: function (res) {
        if (res.data == '') {
          that.setData({
            kong: true
          })
        } else {
          that.setData({
            select: res.data
          })
        }
      },
    })
    //获得缓存判断是否删除回复成功
    var l_shanchu_succe = wx.getStorageSync('l_shanchu_succe')
    var reply_succe = wx.getStorageSync('reply_succe')
    if (l_shanchu_succe) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('l_shanchu_succe', false)
    }
    if (reply_succe) {
      wx.showToast({
        title: '翻译成功',
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('reply_succe', false)
    }
  },
  huan:function(){
    var that=this
    that.setData({
      kong: false,
      select: [],
      act: true
    })
    var uid = wx.getStorageSync('openid')
    wx.request({
      url: 'https://www.uear.net/ajax/info_qiuyi.php',
      data: {
        id: that.data.new_id,
        uid: uid,
        act: 'change'
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        wx.setStorageSync('new_id', res.data.id)
        that.setData({
          new_id: res.data.id,
          name: res.data.username,
          time: res.data.datetime,
          url: res.data.img,
          content: res.data.content,
          sex: res.data.sex,
          title: res.data.title,
          miao: res.data.second,
          del: res.data.del
        })
        wx.request({
          url: 'https://www.uear.net/ajax/info_reply.php',
          data: {
            id: that.data.new_id,
            uid: uid
          },
          method: 'GET',
          success: function (res) {
            if (res.data == '') {
              that.setData({
                kong: true
              })
            } else {
              that.setData({
                select: res.data
              })
            }
          },
        })
      },
    })
    
  },
  n_h:function(e){
    var that=this
    var uid = wx.getStorageSync('openid')
    this.setData({
      new_hot: e.currentTarget.dataset.n_h,
    })
    if(this.data.new_hot=='hot'){
      this.setData({
        act: true
      })
    }else{
      this.setData({
        act: false
      })
    }
    wx.request({
      url: 'https://www.uear.net/ajax/info_reply.php',
      data: {
        id: that.data.new_id,
        uid: uid,
        order: that.data.new_hot
      },
      method: 'GET',
      success: function (res) {
        if (res.data == '') {
          that.setData({
            kong: true
          })
        } else {
          that.setData({
            select: res.data
          })
        }
      },
    })
  },
  cliak_zan:function(e){
    var that=this
    var uid = wx.getStorageSync('openid')
    var reply_id=e.currentTarget.dataset.reply_id
    wx.request({
      url: 'https://www.uear.net/ajax/likes.php',
      data: {
        re_id: reply_id,
        uid: uid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code==1){
          var zan_select = that.data.select
          zan_select[e.currentTarget.dataset.index].zan = true
          zan_select[e.currentTarget.dataset.index].reply_like += 1
          that.setData({
            select: zan_select
          });
        }
      },
    })
  },
  onHide:function(){
    innerAudioContext.stop()
  },
  onUnload:function(){
    innerAudioContext.stop()
  },
  onReachBottom: function () {

  },

})