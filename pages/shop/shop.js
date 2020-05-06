// pages/shop/shop.js
let page;
let key;
let long;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    col:[],
    cloud:[],
    mes: '加载更多',
    mif:true,
    loadif:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadInitData();
  },
  loadInitData: function () {
    var that = this;
    page = 0;
    wx.cloud.callFunction({
      name: 'getcol',
      data: {
        page: page,
        userid: app.globalData.oppenid
      },
      success(res) {
        console.log("纪录", res.result.data);
        long = res.result.data.length;
        if(long<2){
          
          that.setData({
            mif:false
          })
        }
        that.setData({
          col: res.result.data
        })
        var i;
        var len=that.data.col.length;
        for(i=0;i<len;i++){
          that.getCloud(that.data.col[i].wuid); 
        }
        that.setData({
          loadif: false
        })
         
      },
      fail(res) {
        console.log("获取失败", res);
      }
    })
  },
  getm(){
    this.loadMoreData();
  },
  loadMoreData: function () {
    var that = this;
    that.setData({
      mif: true
    })
    
    page = page + 1;
    wx.cloud.callFunction({
      name: 'getcol',
      data: {
        page: page,
        userid: app.globalData.oppenid
      },
      success(res) {
        if (res.result.data.length == 0) {
          that.setData({
            mes: '没有更多了'
          })
        }
        else {
          console.log("修改成功", res.result.data);
          var originArticles = that.data.col;
          var newArticles = originArticles.concat(res.result.data); 
          that.setData({
            col: newArticles,
            cloud: [],
            loadif:false
          })
          var i;
          var len = that.data.col.length;
          for (i = 0; i < len; i++) {
            that.getCloud(that.data.col[i].wuid); 
          }
        }

        },
        fail(res) {
          console.log("获取失败", res);
        }
    })
  },
  getCloud(id){
    var that=this;
    const db = wx.cloud.database().collection("list");
    db.where({
      _id: id
    }).get({
      success(res) {
        console.log("获取成功", res);
        
          var originArticles = that.data.cloud;
          var newArticles = originArticles.concat(res.data);
          that.setData({
            cloud: newArticles,

          })
        
        
        
      },
      fail(res) {
        console.log("获取失败", res);
      }
    })
  },
  enterArt: function (e) {
    var index = e.currentTarget.dataset.id;
    var that = this;
    var cloud = JSON.stringify(that.data.cloud);
    wx.navigateTo({
      url: '../art/art?index=' + index + '&cloud=' + cloud,
      success(res) {

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
    this.setData({
      col: [],
      cloud: []
    })
    this.loadInitData();
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