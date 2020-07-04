const DB = wx.cloud.database().collection("list");
var util = require('../../utils/util.js')
let zan;
let col;
let lock=false;
let lockcol=false;
let page;
let key;
let record=[];
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputShowed: false, 
    imgUrls: ['../image/op1.png', '../image/op2.png', '../image/op3.png'],
    array:[
      
    ],
    search: [],
    cloud:[],
    mes:'点击加载更多',
    mif:true,
    record:[],
    check:true,
    
    
  },

  modetap:function(e){
    var that=this;
    var id=e.currentTarget.dataset.id;
    var array=that.data.array;
    if (id == 0) {
      wx.navigateTo({
        url: '../code/code?title=' + array[id][0],
        success(res) {

        }
      })
    }
    if (id == 1) {
      wx.navigateTo({
        url: '../blank/blank?title=' + array[id][0],
        success(res) {

        }
      })
    }
    if(id==2){
      wx.navigateTo({
        url: '../mod/mod?title=' + array[id][0],
        success(res) {

        }
      })
    }
    if (id == 3) {
      wx.navigateTo({
        url: '../hot/hot?title=' + array[id][0],
        success(res) {

        }
      })
    }
    
    
    
  },
  getInput(event) {
    key = event.detail.value;

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
  enterSearch: function () {
    var that=this;
    if(key.length>0){
        
        wx.navigateTo({
          url: '../result/result?key=' + key,
          success(res) {
            if (record.length < 10) {
              if (record.indexOf(key) == -1) {
                record.push(key);
                that.setData({
                  record: record
                })
                wx.setStorageSync('record', record);
              }

            }
            else {
              if (record.indexOf(key) == -1) {
                record.shift();
                record.push(key);
                that.setData({
                  record: record
                })
                wx.setStorageSync('record', record);
              }

            }
           
          }
        })
    }
    
  },
  enterByKey:function(e){
    var that = this;
    var keyindex = e.currentTarget.dataset.id;
    var that=this;
    var key=that.data.search[keyindex];
    wx.navigateTo({
      url: '../result/result?key=' + key,
      success(res) {
        if (record.length <10) {
          if (record.indexOf(key)==-1){
            record.push(key);
            that.setData({
              record: record
            })
            wx.setStorageSync('record', record);
          }
              
        }
        else {
          if (record.indexOf(key) == -1) {
            record.shift();
            record.push(key);
            that.setData({
              record: record
            })
            wx.setStorageSync('record', record);
          }
          
        }
        
      }
    })
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
  enterByrecord:function(e){
    var thekey = e.currentTarget.dataset.id;
    var that = this;
    wx.navigateTo({
      url: '../result/result?key=' + thekey,
      success(res) {

      }
    })
  },
  deleterecord: function (e) {
    var index = e.currentTarget.dataset.id;
    record.splice(index,1);
    this.setData({
      record: record
    })
    wx.setStorageSync('record', record);
  },
  deleteAll:function(){
    record=[];
    this.setData({
      record: record
    })
    wx.setStorageSync('record', record);
  },
  addcol(e){
    if (app.globalData.userInfo.length == 0 || app.globalData.oppenid==''){
      wx.showModal({
        title: '登录提醒',
        content: '在登录小程序后才能进行点赞和收藏',
        showCancel: false,
        success(res){
          wx.switchTab({
            url: '../my/my',
            
          })
        },
        fail(res){

        }
      })
    }
    else{
      if(lockcol==false){
        lockcol=true;
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
                  
                  wx.cloud.callFunction({
                    name: 'upcol',
                    data: {
                      id: that.data.cloud[index]._id,
                      col: that.data.cloud[index].col
                    },
                    success(res) {
                      
                      
                      
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
                  
                  wx.cloud.callFunction({
                    name: 'upcol',
                    data: {
                      id: that.data.cloud[index]._id,
                      col: that.data.cloud[index].col,
                    },
                    success(res) {
                      
                      
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
  addzan(e){
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
      if(lock==false){
        lock=true;
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
                  
                  wx.cloud.callFunction({
                    name: 'upzan',
                    data: {
                      id: that.data.cloud[index]._id,
                      zan: that.data.cloud[index].zan,
                    },
                    success(res) {
                      
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      record = wx.getStorageSync('record');
      if(!record){
        record=[];
      }
      else{
        that.setData({
          record: record
        })
      }
      var value = wx.getStorageSync('cloud');
      if (value) {
        page = 0;
        console.log("数据",value);
        that.setData({
          cloud: value
        })
      }
      else{
        page = 0;
        this.loadInitData(); 
        
      }
      var array = wx.getStorageSync('array');
      if (array) {
        that.setData({
          array: array
        })
      }
      else {
        wx.cloud.callFunction({
          name: 'getArray',
          success(res) {
            
            if (res.result.data[0].vis==true){
              var array=[];
              array[0] = res.result.data[0].p1;
              array[1] = res.result.data[0].p2;
              array[2] = res.result.data[0].p3;
              array[3] = res.result.data[0].p4;
              that.setData({
                array: array
              })
              wx.setStorageSync('array', array);
            }
            that.setData({
              check: res.result.data[0].tu
            })
          },
          fail(res) {
            console.log("获取失败1", res);
          }
        })

      }

      var search = wx.getStorageSync('search');
      if (search) {
        
        that.setData({
          search: search
        })
      }
      else {
        wx.cloud.callFunction({
          name: 'getSearch',
          success(res) {
            
              var search = [];
              search = res.result.data[0].data;
              that.setData({
                search: search
              })
              wx.setStorageSync('search', search);
            
          },
          fail(res) {
            console.log("获取失败1", res);
          }
        })

      }
    } catch (e) {
      
    }


    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              //that.queryUsreInfo();
              //用户已经授权过
              app.globalData.userInfo = res.userInfo;

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
   
  },
  loadInitData: function (){
    var that=this;
    wx.cloud.callFunction({
      name:'getCloud',
      data: {
        page:page
      },
      success(res) {
       
        that.setData({
          cloud: res.result.data
        })
        wx.setStorageSync('cloud', res.result.data);
      },
          fail(res) {
            console.log("获取失败1", res);
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
        that.setData({
          mif: true
        })
        if (res.result.data.length == 0){
          that.setData({
            mes: '没有更多了',
            mif: true
          })
        }
        else{
          
          var originArticles = that.data.cloud;
          var newArticles = originArticles.concat(res.result.data);
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
  getm(){
    this.setData({
      mif: false
    })
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
    page=0;
    that.loadInitData();
    var array=[];
    wx.setStorageSync('array', array);
    wx.cloud.callFunction({
      name: 'getArray',
      success(res) {
        
        if (res.result.data[0].vis == true) {
          var array = [];
          array[0] = res.result.data[0].p1;
          array[1] = res.result.data[0].p2;
          array[2] = res.result.data[0].p3;
          array[3] = res.result.data[0].p4;
          that.setData({
            array: array
          })
          wx.setStorageSync('array', array);
        }
        that.setData({
          check: res.result.data[0].tu
        })
      },
      fail(res) {
        console.log("获取失败1", res);
      }
    })

    wx.cloud.callFunction({
      name: 'getSearch',
      success(res) {
        
        var search = [];
        search = res.result.data[0].data;
        that.setData({
          search: search
        })
        wx.setStorageSync('search', search);

      },
      fail(res) {
        console.log("获取失败1", res);
      }
    })
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