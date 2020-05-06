const DB = wx.cloud.database().collection("list");
var util = require('../../utils/util.js')
let zan;
let col;
let lock=false;
let page;
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false, 
    imgUrls: ['../image/op1.png', '../image/op2.png', '../image/op3.png',],
    array:[
      {
      lab:'网站源码',
      pic:'../image/51.png'
      },
      {
        lab: '网站模板',
        pic: '../image/54.png'
      },
      {
        lab: '最新上架',
        pic: '../image/16.png'
      },
      {
        lab: '热门排行',
        pic: '../image/41.png'
      }
    ],
    cloud:[],
    mes:'点击加载更多',
    mif:true
    
    
  },

  modetap:function(e){
    var id=e.currentTarget.dataset.id;
    
  },
  // 使文本框进入可编辑状态
  showInput: function () {
    this.setData({
      inputShowed: true   //设置文本框可以输入内容
    });
  },
  // 取消搜索
  hideInput: function () {
    this.setData({
      inputShowed: false
    });
  },
  enterArt:function(e){
    var index = e.currentTarget.dataset.id;
    var that=this;
    var cloud = encodeURIComponent(JSON.stringify(that.data.cloud));
    console.log();
    wx.navigateTo({
      url: '../art/art?index=' + index + '&cloud=' + cloud,
      success(res){
        
      }
    })
  },
  addcol(e){
    var index = e.currentTarget.dataset.id;
    var that = this;
    var wuid = that.data.cloud[index]._id;
    var id = 0;
    col = that.data.cloud[index].col;
    const db = wx.cloud.database().collection("col");
    db.where({
      wuid: wuid,
      userid: app.globalData.oppenid
    }).get({
      success(res) {
        if (res.data.length == 0) {
          wx.showToast({
            title: '收藏成功',
          })
          that.data.cloud[index].col = that.data.cloud[index].col + 1;
          var datacloud = that.data.cloud;
          that.setData({
            cloud: datacloud
          })
          wx.cloud.callFunction({
            name: 'addcol',
            data: {
              wuid: wuid,
              userid: app.globalData.oppenid,
              time: util.formatTime(new Date()),
            },
            success(res) {
              console.log("添加成功", res.result);
              wx.cloud.callFunction({
                name: 'upcol',
                data: {
                  id: that.data.cloud[index]._id,
                  col: that.data.cloud[index].col
                },
                success(res) {
                  console.log("修改成功", res.result);
                  DB.get({
                    success(res) {
                      that.setData({
                        cloud: res.data
                      })
                    },
                    fail(res) {
                      console.log("获取失败", res);
                    }
                  })
                },
                fail(res) {
                  console.log("修改失败", res.result);
                }
              })
            },
            fail(res) {
              console.log("添加失败", res.result);
            }
          })
        }
        else {
          wx.showToast({
            title: '取消成功',
          })
          that.data.cloud[index].col = that.data.cloud[index].col - 1;
          var datacloud = that.data.cloud;
          that.setData({
            cloud: datacloud
          })
          id = res.data[0]._id;
          wx.cloud.callFunction({
            name: 'delcol',
            data: {
              id: id
            },
            success(res) {
              console.log("删除成功", res.result);
              wx.cloud.callFunction({
                name: 'upcol',
                data: {
                  id: that.data.cloud[index]._id,
                  col: that.data.cloud[index].col,
                },
                success(res) {
                  console.log("修改成功", res.result);
                  DB.get({
                    success(res) {
                      that.setData({
                        cloud: res.data
                      })
                    },
                    fail(res) {
                      console.log("获取失败", res);
                    }
                  })
                },
                fail(res) {
                  console.log("修改失败", res.result);
                }
              })
            },
            fail(res) {
              console.log("删除失败", res.result);
            }
          })
        }
      },
      fail(res) {
        console.log("更新失败", res);
      }
    })
  },
  addzan(e){
    var index = e.currentTarget.dataset.id;
    var that = this;
    var wuid = that.data.cloud[index]._id;
    var id=0;
    zan = that.data.cloud[index].zan;
    const db = wx.cloud.database().collection("zan");
    
    db.where({
      wuid: wuid,
      userid: app.globalData.oppenid
    }).get({
      success(res) {
        
        if (res.data.length == 0) {
          wx.showToast({
            title: '点赞成功',
          })
          that.data.cloud[index].zan=that.data.cloud[index].zan+1;
          var datacloud = that.data.cloud;
          that.setData({
            cloud: datacloud
          })
          wx.cloud.callFunction({
            name: 'addzan',
            data: {
              wuid: wuid,
              userid: app.globalData.oppenid,
              time: util.formatTime(new Date()),
            },
            success(res) {
              console.log("添加成功", res.result);
              wx.cloud.callFunction({
                name: 'upzan',
                data: {
                  id:that.data.cloud[index]._id,
                  zan: that.data.cloud[index].zan
                },
                success(res) {
                  console.log("修改成功", res.result);
                  DB.get({
                    success(res) {
                      that.setData({
                        cloud: res.data
                      })
                    },
                    fail(res) {
                      console.log("获取失败", res);
                    }
                  })
                },
                fail(res) {
                  console.log("修改失败", res.result);
                }
              })
            },
            fail(res) {
              console.log("添加失败", res.result);
            }
          })
          }
           else { 
          wx.showToast({
            title: '取消成功',
          })
          that.data.cloud[index].zan = that.data.cloud[index].zan -1;
          var datacloud = that.data.cloud;
          that.setData({
            cloud: datacloud
          })
          id=res.data[0]._id;
          wx.cloud.callFunction({
            name: 'delzan',
            data: {
              id: id
            },
            success(res) {
              console.log("删除成功", res.result);
              wx.cloud.callFunction({
                name: 'upzan',
                data: {
                  id: that.data.cloud[index]._id,
                  zan: that.data.cloud[index].zan,
                },
                success(res) {
                  console.log("修改成功", res.result);
                  DB.get({
                    success(res) {
                      that.setData({
                        cloud: res.data
                      })
                    },
                    fail(res) {
                      console.log("获取失败", res);
                    }
                  })
                },
                fail(res) {
                  console.log("修改失败", res.result);
                }
              })
            },
            fail(res) {
              console.log("删除失败", res.result);
            }
          })
        }
      },
      fail(res) {
        console.log("更新失败", res);
      }
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*var that =this;
    DB.get({
      success(res) {
        
        that.setData({
          cloud:res.data
        })
      },
      fail(res) {
        console.log("获取失败", res);
      }
    })*/
    this.loadInitData();
  },
  loadInitData: function (){
    var that=this;
    page=0;
    wx.cloud.callFunction({
      name:'getCloud',
      data: {
        page:page
      },
      success(res) {
        console.log("修改成功", res.result.data);
        that.setData({
          cloud: res.result.data
        })
      },
          fail(res) {
            console.log("获取失败", res);
          }
    })
  },
  loadMoreData: function (){
    var that = this;
    page = page+1;
    wx.cloud.callFunction({
      name: 'getCloud',
      data: {
        page: page
      },
      success(res) {
        if (res.result.data.length == 0){
          that.setData({
            mes: '没有更多了'
          })
        }
        else{
          console.log("修改成功", res.result.data);
          var originArticles = that.data.cloud;
          var newArticles = originArticles.concat(res.result.data);
          that.setData({
            cloud: newArticles
          })
        }
        
      },
      fail(res) {
        console.log("获取失败", res);
      }
    })
  },
  getm(){
    this.loadMoreData();
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
    var that = this;
    that.loadInitData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    /**/
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})