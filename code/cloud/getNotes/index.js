// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const MAX_LIMIT = 12
// 云函数入口函数
exports.main = async (event, context) => {
  
  return cloud.database().collection('notes').skip(event.page * MAX_LIMIT).limit(MAX_LIMIT).orderBy('time', 'desc').get()
}