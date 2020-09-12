// pages/mod/mod.js
const DB = wx.cloud.database().collection("list");
var util = require('../../utils/util.js')
let zan;
let col;
let lock = false;
let lockcol = false;
let page;
let key;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloud: [],
    mes: '点击加载更多',
    mif: true,
    loadif: true,
    key:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    key = options.key;
    this.setData({
      key:key
    })
    wx.setNavigationBarTitle({
      title: '广场告示'
    })
    page = 0;
    this.loadInitData();
  },
  loadInitData: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'getNotes',
      data: {
        page: page
      },
      success(res) {
        if (res.result.data.length == 0||res.result.data.length <12) {
          that.setData({
            mes: '没有更多了',
            mif:true
          })
        }
        that.setData({
          cloud: res.result.data
        })
        that.setData({
          loadif: false
        })
      },
      fail(res) {
        console.log("获取失败", res);
      }
    })

  },
  loadMoreData: function () {
    var that = this;
    page = page + 1;
    wx.cloud.callFunction({
      name: 'getNotes',
      data: {
        page: page,
        key: key
      },
      success(res) {
        if (res.result.data.length == 0||res.result.data.length <12) {
          that.setData({
            mes: '没有更多了',
            mif:true
          })
        }
        else {
          var originArticles = that.data.cloud;
          var newArticles = originArticles.concat(res.result.data);
          that.setData({
            mif: true
          })
          if (that.data.mif == true) {
            that.setData({
              cloud: newArticles
            })
          }
        }

      },
      fail(res) {
        console.log("获取失败", res);
      }
    })
  },
  getm() {
    this.setData({
      mif: false
    })
    this.loadMoreData();
  },
  enterArt: function (e) {
    var index = e.currentTarget.dataset.id;
    var that = this;
    wx.cloud.callFunction({
      name: 'upview',
      data: {
        id:that.data.cloud[index]._id,
        view: that.data.cloud[index].view+1
      },
      success(res) {
        that.data.cloud[index].view=that.data.cloud[index].view+1;
        that.setData({
          cloud:that.data.cloud
        })
      },
      fail(res) {
        
      }
    })
    var cloud = encodeURIComponent(JSON.stringify(that.data.cloud));
    wx.navigateTo({
      url: '../noteAbout/noteAbout?index=' + index + '&cloud=' + cloud,
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