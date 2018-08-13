
import regeneratorRuntime from 'runtime.js'
var create = function(condition) {
  return new Promise(function(resolve, reject) {
    let tables = new wx.BaaS.TableObject(condition[0])
    let record = tables.create()
    record.set(condition[1]).save().then(res => {
      resolve(res.data)
    })
  })
}

var update = function(condition) {
  return new Promise(function(resolve, reject) {
    let tables = new wx.BaaS.TableObject(condition[0])
    let record = tables.getWithoutData(condition[3])
    let key = condition[1]
    let data = {
      key: condition[2]
    }
    if (condition[1] == 'comment') {
      record.append(key, condition[2]).update().then(res => {
        resolve(res.data)
      })
    } else if (condition[1]=='looknum') {
      record.incrementBy('looknum', 1).update().then(res => {
        resolve(res.data)
      })
    } else {
      record.set(data).update().then(res => {
        resolve(res.data)
      })
    }

  })
}

var query = function(condition) {
  return new Promise(function(resolve, reject) {
    let tables = new wx.BaaS.TableObject(condition[0])
    let query = new wx.BaaS.Query()
    if (condition[1]) {
      query.compare(condition[1], '=', condition[2])
      tables.setQuery(query).find().then(res => {
        resolve(res.data.objects)
      })
    } else {
      tables.limit(10).orderBy('-created_at').find().then(res => {
        resolve(res.data.objects)
      })
    }

  })
}
var del = function(condition) {
  return new Promise(function(resolve, reject) {
    let tables = new wx.BaaS.TableObject(condition[0])
    tables.delete(condition[1]).then(res => {
      resolve(res)
    })
  })
}
var uploadimage = function(path) {
  return new Promise(function(resolve, reject) {
    let MyFile = new wx.BaaS.File()
    let fileParams = {
      filePath: path
    }
    // let metaData = { categoryName: 'SDK' }
    MyFile.upload(fileParams).then(res => {
      let data = res.data
      resolve(data.path)
    }, err => {})
  })
}

module.exports = {
  create: create,
  update: update,
  del: del,
  uploadimage: uploadimage,
  query: query
}