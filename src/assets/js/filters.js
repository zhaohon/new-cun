export default {
  dateND (isoString) {
    let date = new Date(isoString)
    return (date.getMonth() + 1) + '-' + date.getDate()
  },
  date (isoString) {
    let date = new Date(isoString)
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
  },
  datetime (isoString) {
    let date = new Date(isoString)
    return date.getHours() + ':' + date.getMinutes()
  }

}
