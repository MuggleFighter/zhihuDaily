import axios from 'axios'

const Util = {
  imgPath: 'http://127.0.0.1:9001/img/',
  apiPath: 'http://127.0.0.1:9000/',
  // cssPath:''
  getTodayTime() {
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },

  prevDay(timeStamp = (new Date()).getTime()) {
    const date = new Date(timeStamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    return `${year}${month}${day}`
  },
  getDay(timeStamp = (new Date()).getTime()) {
    let date = new Date(timeStamp)
    const dict = ['日','一','二','三','四','五','六']
    return `${dict[date.getDay()]}`
  }
}

Util.ajax = axios.create({
  baseURL: Util.apiPath
})

Util.ajax.interceptors.response.use(res => res.data)

export default Util
