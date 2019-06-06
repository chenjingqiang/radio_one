//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    openid:'',
    userInfo: {},
    selectall:[],
    page:1,
    new_id:'',
    animationData:'',
    succe:false,
    notice_num:0,
    notice:false,
    nine:false
  },
  //页面加载
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '首页'
    })
  },
  aleId:function(e){
    //console.log(e.currentTarget.dataset)
    wx.setStorageSync('new_id', e.currentTarget.dataset.postid)
    wx.setStorageSync('status', e.currentTarget.dataset.status)
    wx.navigateTo({
      url: "../details/details"
    })
  },
  onReachBottom: function () {
    var that=this
    wx.request({
      url: 'https://www.uear.net/ajax/select_qiuyi.php',
      data: {
        uid: that.data.openid,
        page: that.data.page,
        limit:5
      },
      method: 'GET',
      success: function (res) {
        if (res.data!=''){
          that.setData({
            page: that.data.page + 1
          })
          that.setData({
            selectall: that.data.selectall.concat(res.data)
          })
        }else{
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
        }
      }
    })
  },
  bindtap_release:function(){
    wx.navigateTo({
      url: "../release/release"
    })
  },
  //页面显示
  onShow:function(){
    this.setData({
      selectall:[],
      succe: wx.getStorageSync('succe')
    })
    var shanchu_succe = wx.getStorageSync('shanchu_succe')
    if (shanchu_succe) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('shanchu_succe', false)
    }
    if (this.data.succe) {
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 2000
      })
      wx.setStorageSync('succe', false)
    }
    var that = this
    var openid = wx.getStorageSync('openid') || ''
    that.setData({
      openid: openid,
      page:1
    })
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
    wx.request({
      url: 'https://www.uear.net/ajax/select_qiuyi.php',
      data: {
        uid: that.data.openid,
        page:1,
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          selectall: res.data
        })
        that.setData({
          page: that.data.page+1
        })
      },
    })
    //获取通知
    wx.request({
      url: 'https://www.uear.net/ajax/message_count.php',
      data: {
        uid: that.data.openid,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.count>99){
          that.setData({
            nine: true
          })
        }else{
          that.setData({
            notice: res.data.status,
            notice_num: res.data.count
          })
        }
      },
    })
  },
  shanchu:function(e){
    //console.log(e.currentTarget.dataset.postid)
    var that = this
    that.setData({
      new_id: e.currentTarget.dataset.postid
    })
    wx.showModal({
      title: '提示',
      content: '确定删除您的求译吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.uear.net/ajax/del_qiuyi.php',
            data: {
              id: that.data.new_id
            },
            method: 'GET',
            success: function (res) {
              wx.setStorageSync('shanchu_succe', true)
              that.onShow()
            },
          })
        }
      }
    })
  },
  //跳转查看通知
  click_notice:function(){
    wx.navigateTo({
      url: "../notice/notice"
    })
  },
  //页面隐藏
  onHide:function(){
  }
  //下拉刷新
  // onPullDownRefresh() {
  //   this.setData({
  //     la: this.data.la+1
  //   })
  //   wx.stopPullDownRefresh()
  // }
})