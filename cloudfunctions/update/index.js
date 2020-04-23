const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  console.log(event)
  try {
    return await db.collection(event.collection).doc(event.doc)
      .update({
        data: {
          ...event.data
        },
      })
  } catch (e) {
    console.error(e)
  }
}