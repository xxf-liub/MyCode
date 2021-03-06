// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const MAX_LIMIT = 12
// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('list').skip(event.page * MAX_LIMIT).limit(MAX_LIMIT).where({
    title: cloud.database().RegExp({
      regexp: event.key,//miniprogram做为关键字进行匹配
      options: 'i',//不区分大小写
    })
  }).get()
}