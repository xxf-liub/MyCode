// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const MAX_LIMIT = 5
// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection('col').skip(event.page * MAX_LIMIT).limit(MAX_LIMIT).where({
    userid: event.userid
  }).orderBy('time', 'desc').get()
}