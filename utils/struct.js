var data = function(data, path) {
  let datas = {
    "comment": "",
    "race": String(data.race.type),
    "beauty": String(data.beauty),
    "image": path,
    "sex": data.gender.type,
    "skinstatus": '',
    "voice": '',
    "age": String(data.age)
  }
  return datas
}

module.exports = {
  data: data
}