const cheerio = require('cheerio')
const https = require('https')
const http = require('http')
const iconv = require('iconv-lite')

let savedCookList = []

async function getHttps(fn, url, i) {
  return new Promise((resolve) => {
    // console.log(`开始提取第${i}条数据`)
    https.get(url, (sres) => {
      let chunks = []
      sres.on('data', (chunk) => {
        chunks.push(chunk)
      })
      sres.on('end', () => {
        const html = iconv.decode(Buffer.concat(chunks), 'UTF-8');
        const $ = cheerio.load(html, {decodeEntities: false})
        let result = fn($)
        // console.log(`第${i}条数据提取结束`)
        resolve(result)
      })
    })
  })
}

function pigItemsHandle($) {
  let items = []
  $('#content .food-type ul li').each((idx, element) => {
    const $element = $(element).children('a')
    items.push('https' + $element.attr('href').split('http')[1])
  })
  return items
}

async function pigItemHandle($) {
  let itemObj = {}
  $('#content #left .material').each((idx, element) => {
    const pic = $(element).children('.material-img').children('a').children('img').attr('src')
    const name = $(element).children('.des-material').children('h3').text()
    const nickname = $(element).children('.des-material').children('p').eq('0').text().split('别名：')[1]
    const category = $(element).children('.des-material').children('p').eq('2').children('a').text()
    itemObj = {
      pic, name, nickname, category
    }
  })
  let links = []
  const domain = 'https://www.douguo.com/'
  for (let i=0; i<4; i++) {
    links.push(domain + $('#content #left .type-tab').eq('1').children('.type-head').children('a').eq(i.toString()).attr('href'))
  }
  itemObj = Object.assign({}, await linksHandle(links), itemObj)
  let cookListUrls = []
  $('#content #left .mt20 .pages a').each((idx, element) => {
    cookListUrls.push('https' + $(element).attr('href').split('http')[1])
  })
  const cookList = await cookListHandle(cookListUrls)
  itemObj.cookList = cookList[0]
  return [itemObj, cookList[1]]
}

async function cookListHandle(urls) {
  let result = []
  let cookList = []
  const handle = ($) => {
    let resultArr = []
    $('#content #left .cook-list li').each((idx, element) => {
      const el = $(element).children('.cook-info')
      const pic = $(element).children('a').css('background-image')
      const name = el.children('.cookname').text()
      const major = el.children('.major').text()
      const url = 'https://www.douguo.com/' + $(element).children('a').attr('href')
      resultArr.push({ pic, name, major, url })
    })
    return resultArr
  }
  for(let i=1; i<urls.length; i++) {
    if (i + 1 !== urls.length && i + 2 !== urls.length) {
      result = result.concat(await getHttps(handle, urls[i]))
      for(let j=0; j<result.length; j++) {
        // get cookList data
        cookResult = await cookItemHandle(result[j].url)
        if (!cookResult.name) continue
        cookList.push(cookResult)
        result[j].pic = cookResult.pic
      }
    }
  }
  return [result, cookList]
}

async function cookItemHandle(url) {
  const handle = ($) => {
    // name
    const name = $('#content #left .rinfo .title').text()
    if (savedCookList.indexOf(name) < 0) {

      // pic
      const pic = $('#content #left #banner a img').attr('src')
      // material
      const table = $('#content #left .material table thbody')
      let material = ''
      table.children('tr').each((i, tr) => {
        $(tr).children('td').each((j, td) => {
          $(td).children('span').each((k, span) => {
            if (k % 2 !== 0) {
              material += ($(span).text() + ':')
            } else {
              material += ($(span).text() + ';')
            }
          })
        })
      })
      // step
      let stepPic = ''
      let stepDes = ''
      $('#content #left .step .stepcont').each((idx, element) => {
        const $el = $(element)
        stepPic += ($el.children('a').children('img').attr('src') + ';')
        stepDes += ($el.children('.stepinfo').text() + ';')
      })
      // tips
      const tips = $('#content #left .tips p').text()
      // category
      let category = ''
      $('#content #left .copyright .fenlei span').each((idx, element) => {
        const $el = $(element)
        if(idx === 0) {
          category += ($el.children('a').text())
        } else {
          category += (',' + $el.children('a').text())
        }
      })
      // related cookList
      let relatedList = []
      $('#content #left .bot-list .recipe-list li').each((idx, element) => {
        const $el = $(element)
        const pic = $el.children('a').children('img').attr('src')
        const name = $el.children('div').children('a').text()
        relatedList.push({ pic, name })
      })

      // save cook list name
      savedCookList.push(name)

      return { pic, name, material, stepPic, stepDes, tips, category, relatedList }
    } else {
      return {}
    }
  }

  return await getHttps(handle, url)
}

async function linksHandle(links) {
  let resultObj = {}
  const handle = [
    function($) {
      const el = $('#content #left .description')
      // introduction
      const des = el.children('.introduction').children('p').text()
      // nutrition
      let nutrition = ''
      const table = el.children('.nutrition').children('table').children('tbody')
      table.children('tr').each((i, tr) => {
        $(tr).children('td').each((j, td) => {
          if ((j + 1) % 2 === 0) {
            nutrition += ($(td).text() + ':')
          } else {
            nutrition += ($(td).text() + ';')
          }
        })
      })
      // effect
      const effect = el.children('.effect').children('p').text()
      // value
      const value = el.children('.storage').eq('0').children('p').text()
      // selection
      const selection = el.children('.storage').eq('1').children('p').text()
      // save
      const save = el.children('.storage').eq('2').children('p').text()
      return { des, nutrition, effect, value, selection, save }
    },
    function($) {
      let phase = []
      const el = $('#content #left .phase ul li').each((idx, element) => {
        phase.push($(element).children('p').text())
      })
      const peopleList = $('#content #left .phase .people-list').text()
      return { phase, peopleList }
    },
    function($) {
      let match = []
      const el = $('#content #left .reason ul li').each((idx, element) => {
        match.push($(element).children('p').text())
      })
      return { match }
    }
  ]
  for (let i=1; i<links.length; i++) {
    let result = await getHttps(handle[i - 1], links[i])
    resultObj = Object.assign({}, result, resultObj)
  }
  return resultObj
}

function getPromiseArr(urls) {
  let promiseArr = []
  let promiseResult = []
  let i = 0
  let j = 0
  while(promiseResult.length < 6) {
    if (promiseArr.length < 4) {
      promiseArr.push(getHttps(pigItemHandle, urls[i], i))
      j++
    } else {
      promiseResult.push(promiseArr)
      j = 0
    }
    i++
  }
  return promiseResult
}

async function getUrls() {
  console.log('开始获取猪分类数据')
  const start = new Date().getTime()
  const pigUrl = 'https://www.douguo.com/shicai/65/17'
  let pigUrlItems = await getHttps(pigItemsHandle, pigUrl)
  // console.log(pigUrlItems)
  let pigItems = []
  let pigResult = []
  let cookList = []

  let promiseResult = getPromiseArr(pigUrlItems)
  for(let i=0; i<1; i++) {
    pigResult = await Promise.all(promiseResult[i])
    for(let j=0; j<pigResult.length; j++) {
      pigItems[j] = pigResult[j][0]
      cookList.push(pigResult[j][1])
    }
  }

  const end = new Date().getTime()
  const cost = Math.abs((end - start))/1000
  console.log(`耗时${cost}秒`)
}

getUrls()
