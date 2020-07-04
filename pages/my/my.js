const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userif:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pic:"",
    about:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.cloud.callFunction({
      name: 'getAbout',
      success(res) {
        
        that.setData({
          pic: res.result.data[0].pic,
          about: res.result.data[0].about,
        })
        
      },
      fail(res) {
        
      }
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              //that.queryUsreInfo();
              //用户已经授权过
              app.globalData.userInfo = res.userInfo; 
              that.setData({
                userInfo: app.globalData.userInfo,
                userif: true
              })
            }
          });
          wx.cloud.callFunction({
            name: "getopenid",
            success(res) {
              app.globalData.oppenid = res.result.openid;
            },
            fail(res) {
              console.log("获取用户openid失败", res.result.openid);
            }
          })
        }
      }
    })
    
    console.log('1');
    console.log(app.globalData.userInfo);
    console.log(app.globalData.oppenid);
    console.log('2')
  },
  about: function (){
    var that=this;
        wx.showModal({
          title: '关于我们',
          content: that.data.about,
        })
        
      
    
    
},
  bindGetUserInfo: function (e) {
    console.log('a')
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: function (res) {
          //从数据库获取用户信息
          //that.queryUsreInfo();
          //用户已经授权过
          app.globalData.userInfo = res.userInfo; console.log('a')
          that.setData({
            userInfo: app.globalData.userInfo,
            userif: true
          })
          
        }
      });
      //用户按了允许授权按钮
      var that = this;
      //授权成功后，跳转进入小程序首页
      app.globalData.userInfo = e.detail.rawData; 
      this.setData({
        userInfo: app.globalData.userInfo,
        userif: true
      })
      wx.cloud.callFunction({
        name: "getopenid",
        success(res) {
          app.globalData.oppenid = res.result.openid; 
        },
        fail(res) {
          console.log("获取用户openid失败", res.result.openid);
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '微源商城',
      desc: '免费全面的程序源码',
      path: "pages/home/home",
      imageUrl:'../image/op1.png',

    }
  }
  ,
  enterAdmin(){
    if (app.globalData.oppenid == 'ooxkO5JHqW5WCpmAcZgLrEWKzOKI'){
      wx.navigateTo({
        url: '../admin/admin',
      })
    }
    else{
      wx.showModal({
        title: '权限验证',
        content: '当前用户并未获取权限，请联系管理员获取权限',
      })
    }
    
  },
  enterCol(){
    if (app.globalData.oppenid == 'ooxkO5JHqW5WCpmAcZgLrEWKzOKI'){
      wx.navigateTo({
        url: '../shop/shop',
      })
    }
    else{
      wx.showModal({
        title: '未登录',
        content: '登录后获取收藏权限',
      })
    }
    
  }
})