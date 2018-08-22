const Time = {
  getUnix() {
    const date = new Date()
    return date.getTime()
  },

  getTodayUnix() {
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },

  getYearUnix() {
    const date = new Date()
    date.setMonth(0)
    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date.getTime()
  },

  getLastDate(time) {
    const date = new Date(time)
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDay() + 1}` : date.getDate()
    return `${date.getFullYear()}-${month}-${day}`
  },

  getFormatTime(timestamp) {
    const now = this.getUnix()
    const today = this.getTodayUnix()
    const year = this.getYearUnix()
    const timer = (now - timestamp) / 1000
    let tip = ''
    switch (true) {
      case Math.floor(timer / 60 <= 0):
        tip = '刚刚'
        break
      case timer < 3600:
        tip = `${Math.floor(timer / 60)}分钟前`
        break
      case timer >= 3600 && timestamp - today >= 0:
        tip = `${Math.floor(timer / 3600)}小时前`
        break
      case timer / 86400 <= 31:
        tip = `${Math.floor(timer / 86400)}天前`
        break
      default:
        tip = this.getLastDate(timestamp)
    }

    return tip
  }
}

export default {
  bind(el,binding){
    // 返回的数据里面的时间戳为实际时间戳除以1000，所以这里需要重新乘以1000
    el.innerText = Time.getFormatTime(binding.value * 1000)
    el.__timeout__ = setInterval(() => {
      el.innerText = Time.getFormatTime(binding.value * 1000)
    },60000)
  },
  unbind(el) {
    clearInterval(el.__timeout__)
    delete el.__timeout__
  }
}
