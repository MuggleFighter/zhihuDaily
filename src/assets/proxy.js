const http = require('http')
const request = require('request')

const hostname = '127.0.0.1'
const port = 9000
const imgPort = 9001

const apiServer = http.createServer((req, res) => {
  const url = 'http://news-at.zhihu.com/api/4' + req.url
  // console.log(req)
  headers = {
    'If-Modified-Since': req.headers['If-Modified-Since'],
    'If-None-Match': req.headers['If-None-Match']
  }
  function callback(error, response, body) {
    if (!error && (response.statusCode < 300 && response.statusCode >= 200 || response.statusCode === 304)) {
      // res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
      res.setHeader('Access-Control-Allow-Origin', '*')
      if (req.headers['if-modified-since'] === response.headers['last-modified'] && req.headers['if-none-match'] ===  response.headers['etag']){
        res.writeHead(304,response.headers)
      }else{
        res.writeHead(200,response.headers)
      }
      res.end(body)
    }
  }
  request.get({url,headers}, callback)
})

apiServer.listen(port, hostname, () => {
  console.log(`apiServer listen at http://${hostname}:${port}`)
})

const imgServer = http.createServer((req, res) => {
  const url = req.url.split('/img/')[1]
  const encoding = null
  headers = {
    'If-Modified-Since': req.headers['If-Modified-Since'],
    'If-None-Match': req.headers['If-None-Match']
  }

  function callback(error, response, body) {
    if (!error && (response.statusCode < 300 && response.statusCode >= 200 || response.statusCode === 304)) {
      const contentType = response.headers['content-type']
      // res.setHeader('Content-Type', contentType)
      res.setHeader('Access-Control-Allow-Origin', '*')
      // res.setHeader('Cache-Control',)
      // res.writeHead(response.statusCode,response.headers)
      // console.log(req.headers)
      if (req.headers['if-modified-since'] === response.headers['last-modified'] && req.headers['if-none-match'] ===  response.headers['etag']){
        res.writeHead(304,response.headers)
      }else{
        res.writeHead(200,response.headers)
      }
      res.end(body)
    }
  }
  request({url, encoding,headers}, callback)
})

imgServer.listen(imgPort, hostname, () => {
  console.log(`imgServer listen at http://${hostname}:${imgPort}`)
})
