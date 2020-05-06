//app.js
App({
  
  
 
  onLaunch: function () {
    wx.cloud.init({
      env: "wysc-wdgyz"
    })
   
  },
  globalData: {
    userInfo: {},
    oppenid:'',
    appid: 'wx265468310f8c8156',//appid需自己提供，此处的appid我随机编写
    secret: '69a16636a5d25364a54ce27eabf212af',//secret需自己提供，此处的secret我随机编写
  
  }
})