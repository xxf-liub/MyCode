// pages/mod/mod.js
const DB = wx.cloud.database().collection("list");
var util = require('../../utils/util.js')
let zan;
let col;
let lock = false;
let lockcol = false;
let page;
let type = '微擎模块';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: ['微擎模块', '影视源码', '小说源码', '游戏棋牌', '其他源码'],
    cloud: [],
    mes: '点击加载更多',
    mif: true,
    loadif: true,
    currentTab:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = options.title;
    wx.setNavigationBarTitle({
      title: title
    })
    page = 0;
    this.loadInitData();
  },
  tabSelect(e){
   
    var id = e.currentTarget.dataset.id;
    this.setData({
      currentTab:id,
      loadif: true,
      mes: '加载更多',
    })
    if (id == 0) type ='微擎模块';
    else if (id == 1) type = '影视源码';
    else if (id == 2) type = '小说源码';
    else if (id == 3) type ='游戏棋牌';
    else type = '其他源码';
    page = 0;
    this.loadInitData();
   
  },
  loadInitData: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'getCode',
      data: {
        page: page,
        type:type
      },
      success(res) {
        console.log("修改成功", res.result.data);
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
      name: 'getCode',
      data: {
        page: page,
        type: type
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
          var originArticles = that.data.cloud;
          var newArticles = originArticles.concat(res.result.data);
          that.setData({
            mif: true
          })
          if(that.data.mif==true){
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
      name: 'upzan',
      data: {
        id:that.data.cloud[index]._id,
        zan: that.data.cloud[index].zan+1
      },
      success(res) {
        that.data.cloud[index].zan=that.data.cloud[index].zan+1;
        that.setData({
          cloud:that.data.cloud
        })
      },
      fail(res) {
        
      }
    })
    var cloud = encodeURIComponent(JSON.stringify(that.data.cloud));
    console.log();
    wx.navigateTo({
      url: '../art/art?index=' + index + '&cloud=' + cloud,
      success(res) {

      }
    })
  },

  addcol(e) {
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
      if (lockcol == false) {
        lockcol = true;
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
                      lockcol = false;
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
                      lockcol = false;
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
      }
    }
  },
  addzan(e) {
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
      if (lock == false) {
        lock = true;
        var index = e.currentTarget.dataset.id;
        var that = this;
        var wuid = that.data.cloud[index]._id;
        var id = 0;
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
              that.data.cloud[index].zan = that.data.cloud[index].zan + 1;
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
                      id: that.data.cloud[index]._id,
                      zan: that.data.cloud[index].zan
                    },
                    success(res) {
                      console.log("修改成功", res.result);

                      lock = false;
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
              that.data.cloud[index].zan = that.data.cloud[index].zan - 1;
              var datacloud = that.data.cloud;
              that.setData({
                cloud: datacloud
              })
              id = res.data[0]._id;
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

                      lock = false;
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
      }
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
    page = 0;
    type = '微擎模块';
    this.loadInitData();
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