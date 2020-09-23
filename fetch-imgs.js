var fetch = require('node-fetch')
var cheerio = require('cheerio')
var path = require('path')
var fs = require('fs')
var cmd=require('node-cmd');

var argv = process.argv
var url = argv[2] || 'http://jandan.net/ooxx'
var selector = argv[3] || ".commentlist .text p img"
var folderName = argv[4] || Math.random().toString(36).substr(2, 8)
var directory = argv[4] ? `imgs/${folderName}` : `ramdImg/${folderName}`
fs.mkdirSync(directory)

function parseImgs(content) {
	var $ = cheerio.load(content)
	var imgs = []
	$(selector).each(function(index, img) {
		var src = $(img).attr('src')
		if (src.indexOf('//') === 0) src = 'http:' + src
		imgs.push(src)
	})
	return imgs
}

async function saveImg(img) {
	var basename = path.basename(img)
	var filePath = path.join(directory, basename)
	console.time(basename)
	var res = await fetch(img)
	var writeStream = fs.createWriteStream(filePath)
	writeStream.on('finish', console.timeEnd.bind(console, basename))
	res.body.pipe(writeStream)
}

async function fetchImgs(url) {
	var res = await fetch(url)
	var content = await res.text()
	var imgs = parseImgs(content)
	imgs.forEach(saveImg)
	console.log(res , imgs);
}
  

setTimeout(()=>{
	var cmds = `node index ${url} "${selector}"` + ''
	console.log(cmds);
	cmd.run(cmds);
},1000)  
fetchImgs(url)
.catch(error => console.log('error',error))