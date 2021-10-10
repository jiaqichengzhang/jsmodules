/**
 * 嵌套的语句转css
 * author：jqCheng
 */
import cssjson from './cssjson'
function nested2Css(nestedStr) {
  const allRes = {}
  parseSass(nestedStr)
  return allRes
  function parseSass(cssContent) {
    let cssStr = cssContent.replace(/\s+/g, ' ').replace(/\s+?\{\s+?/g, '{').replace(/\s+?\}/g, '}')
    // 递归
    let obj = cutStr2Obj(cssStr)
    loopStrObj(obj)
  }
  function loopStrObj(obj, pName) {
    const reg = /\S+?\{(.*)\}/
    for (let key in obj) {
      let cssStr = obj[key]
      const result = cssStr.match(reg)
      const cssObj = getCssObj(result, pName)
      if (cssObj) {
        const { elemName, attr } = cssObj
        allRes[elemName] = attr
        cssStr = result?.[1]
        // 循环
        let pName1 = elemName
        let obj1 = cutStr2Obj(cssStr)
        loopStrObj(obj1, pName1)
      }
    }
  }
  function cutStr2Obj(cssStr) {
    const obj = {}
    while (cssStr) {
      const elemName = getElemName(cssStr)
      const { start, end } = getBracketIndex(cssStr)
      const str = elemName + cssStr.substring(start, end)
      if (elemName && str)obj[elemName] = str
      cssStr = cssStr.slice(end)
    }
    return obj
  }
  function getCssObj(result, pName) {
    if (result && result[1]) {
      const elemName = getElemName(result['input'])
      const cssContent = result[1].replace(/\S+?\{(.*)\}/g, ' ')
      const attr = cssjson.toJSON(cssContent).attributes
      return {
        elemName: pName ? `${pName} ${elemName}` : elemName,
        attr
      }
    }
  }

  function getBracketIndex(str) {
    const start = str.indexOf('{')
    let fs = 1
    let flag = true
    let newstr = str.slice(start + 1)
    let end = start + 1
    let k = 0
    while (flag && k < 1000) {
      const i = newstr.indexOf('{')
      const j = newstr.indexOf('}')
      if (i !== -1 && i < j) {
        fs++
        newstr = newstr.slice(i + 1)
        end += i + 1
      } else if (j !== -1 && j < i) {
        fs--
        newstr = newstr.slice(j + 1)
        end += j + 1
      } else if (i === -1 && j !== -1) {
        fs--
        newstr = newstr.slice(j + 1)
        end += j + 1
      }
      if (fs <= 0)flag = false
      k++ // 放置错误格式造成死循环
    }
    return { start, end: end + 1 }
  }
  function getElemName(str) {
    const end = str.indexOf('{')
    const newStr = str.substring(0, end)
    const start = newStr.lastIndexOf('}') !== -1 ? newStr.lastIndexOf('}')
      : (newStr.lastIndexOf(';') !== -1 ? newStr.lastIndexOf(';') : -1)
    const name = str.substring(start + 1, end).trim()
    return name
  }
}
export default nested2Css
/*
// 测试demo
function test() {
  let cssContent = `:root{
   border:1px solid deeppink;
   background:deeppink;
   div{
      border:1px solid deepblue;
	  text-decoration:underline;
      p{
          font-size:14px;
          color:red;
          span{
              padding:10px;
          }
      }
   }
   ul{
       display:flex;
       align-items:center;
       li{
           margin:10px;
           img{
               width:10px;
               height:10px;
           }
           b{
               color:black;
           }
       }
       .item{
           margin-right:1px;
       }
   }
}
body{
    font-family:'微软雅黑'
    *{
        padding:0;
        margin:0
    }
}`
  console.log(nested2Css(cssContent))
}
test()
 */
