// pages/notice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    kong:false,
    clear:false,
    animationData: '',
    selectall:[],
    qiuyi_id:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '全部通知'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this
    that.setData({
      uid: wx.getStorageSync('openid'),
      kong:false,
      clear: false,
      selectall:[]
    })
    wx.request({
      url: 'https://www.uear.net/ajax/message_data.php',
      data: {
        uid: that.data.uid,
      },
      method: 'GET',
      success: function (res) {
        if (res.data==0){
          that.setData({
            kong: true
          })
        }else{
          that.setData({
            selectall: res.data,
            clear:true
          })
        }
      },
    })
  },
  re_notice:function(e){
    var that=this
    wx.request({
      url: 'https://www.uear.net/ajax/message_read.php',
      data: {
        re_id: e.currentTarget.dataset.postid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code==1){
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          that.onShow()
        }
      },
    })
  },
  read:function(e){
    var that=this
    that.setData({
      qiuyi_id: e.currentTarget.dataset.qiuyi_id,
    })
    wx.request({
      url: 'https://www.uear.net/ajax/message_read.php',
      data: {
        re_id: e.currentTarget.dataset.postid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          wx.setStorageSync('new_id', that.data.qiuyi_id)
          wx.setStorageSync('status', 1)
          wx.navigateTo({
            url: "../details/details"
          })
        }
      },
    })
  },
  clear:function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '确定删除您的通知吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.uear.net/ajax/message_clear.php',
            data: {
              uid: that.data.uid,
            },
            method: 'GET',
            success: function (res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '清除成功',
                  icon: 'success',
                  duration: 2000
                })
                that.onShow()
              }
            },
          })
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var animation = wx.createAnimation({
      duration: 1000,
    })
    animation.opacity(0.7).step();
    that.setData({
      animationData: animation.export(),
    })
    clearTimeout(timer)
    var timer = setTimeout(function () {
      var animation = wx.createAnimation({
        duration: 1000,
      })
      animation.opacity(0).step();
      that.setData({
        animationData: animation.export(),
      })
    }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})