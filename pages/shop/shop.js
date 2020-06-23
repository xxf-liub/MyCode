// pages/shop/shop.js
var util = require('../../utils/dateUtil.js');
let page;
let key;
let long;
let cj=0;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloud:[],
    mes: '加载更多',
    mif:true,
    loadif:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo.length == 0 || app.globalData.oppenid == '') {
      wx.showModal({
        title: '登录提醒',
        content: '在登录小程序后才能进行点赞和收藏',
        showCancel: false,
        success(res) {
          wx.switchTab({
            url: '../my/my',

          })
        },
        fail(res) {

        }
      })
    }
    else {
    this.loadInitData();
    }
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
        var i;
        var len = res.result.data.length;
        for(i=0;i<len;i++){
          that.getCloud(res.result.data[i].wuid, res.result.data[i].time); 
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
    this.setData({
      mif: false
    })
    this.loadMoreData();
  },
  loadMoreData: function () {
    var that = this;
    
    
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
            mes: '没有更多了',
            mif:true
          })
        }
        else {
          console.log("修改成功", res.result.data);
          
          that.setData({
            loadif:false
          })
          var i;
          var len = res.result.data.length;
          for (i = 0; i < len; i++) {
            that.getCloud(res.result.data[i].wuid, res.result.data[i].time); 
          }
        }

        },
        fail(res) {
          console.log("获取失败", res);
        }
    })
  },
  getCloud(id,time){
    var that=this;
    const db = wx.cloud.database().collection("list");
    db.where({
      _id: id
    }).get({
      success(res) {
        if (res.data.length != 0) {
          
          var obj =new Object();
          obj.time=time;
          obj.data = res.data;
          var cloud = that.data.cloud;
          cloud[cj]=obj;
          cj++;
          cloud=that.sortCloud(cloud);
          if (that.data.mif == false) {
            that.setData({
              mif: true
            })
          }
          
          else{
            that.setData({
              cloud: cloud
            })
          }
         
          
        }
      },
      fail(res) {
        console.log("获取失败", res);
      }
    })
  },
  enterArt: function (e) {
    var that =this;
    var cloud = wx.getStorageSync('cloud');
    var index = e.currentTarget.dataset.id;
    cloud = cloud.concat(that.data.cloud[index].data); 
    var ind = cloud.length - 1; console.log(cloud[ind]);
    cloud = encodeURIComponent(JSON.stringify(cloud));
    
    wx.navigateTo({
      url: '../art/art?index=' +ind + '&cloud=' + cloud,
      success(res) {

      }
    })
  },
  sortCloud(cloud){
    var cloud=cloud;
    var that=this;
    var len = cloud.length; console.log("cloud[i].time");
    for(var i=0;i<len;i++){
      for(var j=i;j<len;j++){
        if (util.compareTime(cloud[i].time, cloud[j].time)==true){
          var temp = cloud[i];
          cloud[i]= cloud[j];
          cloud[j]=temp;
        }

      }
      console.log(cloud[i].time);
    }
    return cloud;
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
      cloud: []
    })
    page=0;
    cj=0;
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