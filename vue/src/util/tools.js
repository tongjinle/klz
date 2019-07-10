
const formateTime = function(time) {
    if (!time) {
        return time
    }
    time = new Date(time)
    let y = time.getFullYear()
    let mo = time.getMonth() + 1
    let d = time.getDate()
    let h = time.getHours()
    let mi = time.getMinutes()
    let s = time.getSeconds()
    return y + '-' + (mo >= 10 ? mo : '0' + mo) + '-' + (d >= 10 ? d : '0' + d) + ' ' + (h >= 10 ? h : '0' + h) + ':' + (mi >= 10 ? mi : '0' + mi) + ':' + (s >= 10 ? s : '0' + s)
}


let date = null;
let offSet = 60 * 1000 * (new Date(0)).getTimezoneOffset()
const dateFormatter = (datetime, fmt, fix) => {
    // fmt 格式 yyyy-MM-dd HH:mm:ss
    offSet = !fix ? 0 : offSet
    if (datetime instanceof Date) {
      date = datetime
    } else {
      date = new Date(+datetime + offSet)
    }
    let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': (date.getHours() % 12) === 0 ? 12 : (date.getHours() % 12), // 小时
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[date.getDay() + ''])
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
}

// const deleteEmpty = function(param) {
//   for (var key in param) {
//       if (param[key] + '' !== '0') {
//           if (!param[key] || param[key].length === 0 || param[key] === 'A') {
//               delete param[key]
//           } else {
//               param[key].join ? param[key] = param[key].join(',') : ''
//           }
//       }
//   }
//   return param
// }

// 银行钱数展示加 逗号 分隔
const moneyFormat = function(num) { //123455.32323=>123,455.32323
  if (typeof num != 'number') return num;
  let isNegative = false;
  if (num < 0) {
      isNegative = true;
  }
  num = Math.abs(num);
  let str = new String(num);
  let str0, str1;
  if (str.indexOf('.') != -1) {
      str0 = str.split('.')[0];
      str1 = '.' + str.split('.')[1];
  } else {
      str0 = str;
      str1 = '';
  }
  let arr = str0.split('');
  var sub = [];
  if (arr.length > 3) {
      var start = arr.length % 3;
      if (start != 0) sub.push(start);
      for (let i = 0; i < arr.length; i++) {
          if ((i + 1 - start != 0) && (i + 1 - start) % 3 == 0 && (i + 1) != arr.length) {
              sub.push(i + 1);
          }
      }
      sub.map((value, index) => {
          if (index != 0) {
              value += index;
          }
          arr.splice(value, 0, ',')
      });
      return (isNegative ? '-' : '') + arr.join('') + str1;
  } else {
      return (isNegative ? '-' : '') + num
  }
}

// 正则校验
const regObj = {
  numberFloat: /^[0-9]+(\.[0-9]+)?$/, //正浮点数包括0
  numberLetter: /^[0-9a-zA-Z]+$/, //数字和字母
  phone: /^1[0-9]{10}$/, //手机号码
  number: /^\d+$/, //正整数
  numberFloat2: /^[0-9]+([.]{1}[0-9]{1,2})?$/, //正整数或保留两位小数以内
}

//数组去重
const removeRepeat = function(arr) {
  let newArr = [];
  let json = {};
  for (var i = 0; i < arr.length; i++) {
      if (!json[arr[i]]) {
          json[arr[i]] = 1
          newArr.push(arr[i]);
      }
  }
  return newArr
}

export {
    formateTime,
    dateFormatter,
    // deleteEmpty,
    moneyFormat,
    regObj,
    removeRepeat,
}