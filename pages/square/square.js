// pages/square/square.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pic:[],
      left:"",
      right1:"",
      right2:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.cloud.callFunction({
      name:'Square',
      success(res) {
        
        that.setData({
          left:res.result.data[0].left,
          right1:res.result.data[0].right1,
          right2:res.result.data[0].right2,
          pic:res.result.data[0].pic
        })
        
      },
      fail(res) {
            console.log("获取失败", res);
      }
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

  }
})