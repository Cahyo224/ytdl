const axios = require("axios")
const convertSec = require("../function")
const fetch = require("node-fetch")

async function yt(url) {
  const { data } = await axios(`https://www.y2mate.com/mates/en948/analyzeV2/ajax`, {
    method: "post",
    data: { k_query: url, k_page: "home", hl: "en", q_auto: 0 },
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "cookie": "_ga_PSRPB96YVC=GS1.1.1726204937.1.0.1726204937.0.0.0; _ga=GA1.1.1317087614.1726204938",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
    }
  })
  return data
}

async function ytmp3(url) {
  try {
    const info = await yt(url)
    const { data } = await axios(`https://www.y2mate.com/mates/convertV2/index`, {
      method: "post",
      data: {
        vid: await info.vid,
        k: await info.links.mp3.mp3128.k
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cookie": "_ga=GA1.1.1317087614.1726204938; _ga_PSRPB96YVC=GS1.1.1726204937.1.1.1726205011.0.0.0",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
      }
    })
    const thumb = `https://i.ytimg.com/vi/${info.vid}/maxresdefault.jpg`
    const { status } = await fetch(thumb)
    if (status !== 200) {
      var thumbImg = `https://i.ytimg.com/vi/${info.vid}/hqdefault.jpg`
    } else {
      var thumbImg = await thumb
    }
    const result = {
      status: true,
      title: await data.title,
      channel: await info.a,
      duration: await convertSec(info.t),
      size: await info.links.mp3.mp3128.size,
      type: await data.ftype,
      quality: await `${data.fquality}Kbps`,
      id: await info.vid,
      thumbnail: await thumbImg,
      url: await data.dlink
    }
    return await result
  } catch {
    const result = {
      status: false,
      message: "Can't get metadata"
    }
    console.log(result)
    return result
  }
}

async function ytmp4(url, quality) {
  try {
    const info = await yt(url)
    if (!info.links.mp4["137"]) {
      var qualityHD = 299
    } else {
      var qualityHD = 137
    }
    if (!info.links.mp4["134"]) {
      var qualityH = 18
    } else {
      var qualityH = 134
    }
    if (quality === 1080) {
      var res = qualityHD
    } else if (quality === 720) {
      var res = 22
    } else if (quality === 480) {
      var res = 135
    } else if (quality === 360 || quality === undefined || quality === 0) {
      var res = qualityH
    }
    const { data } = await axios(`https://www.y2mate.com/mates/convertV2/index`, {
      method: "post",
      data: {
        vid: await info.vid,
        k: await info.links.mp4[`${res}`].k
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cookie": "_ga=GA1.1.1317087614.1726204938; _ga_PSRPB96YVC=GS1.1.1726204937.1.1.1726205272.0.0.0",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
      }
    })
    const thumb = `https://i.ytimg.com/vi/${info.vid}/maxresdefault.jpg`
    const { status } = await fetch(thumb)
    if (status !== 200) {
      var thumbImg = `https://i.ytimg.com/vi/${info.vid}/hqdefault.jpg`
    } else {
      var thumbImg = thumb
    }
    const result = {
      status: true,
      title: data.title,
      channel: info.a,
      duration: convertSec(info.t),
      size: info.links.mp4[`${res}`].size,
      type: data.ftype,
      quality: data.fquality,
      id: info.vid,
      thumbnail: thumbImg,
      url: decodeURIComponent(data.dlink)
    }
    return result
  } catch {
    const result = {
      status: false,
      message: "Can't get metadata"
    }
    console.log(result)
    return result
  }
}

module.exports = { yt, ytmp3, ytmp4 }
