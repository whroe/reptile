var fs = require('fs')
var argv = process.argv
var flag = argv[3] || false
var fileNamePth = argv[2] || './imgs/repilt'
function delDir(p) {
    // 读取文件夹中所有文件及文件夹
    var list = fs.readdirSync(p)
    list.forEach((v, i) => {
      // 拼接路径
      var url = p + '/' + v
      // 读取文件信息
      var stats = fs.statSync(url)
      // 判断是文件还是文件夹
      if (stats.isFile()) {
        // 当前为文件，则删除文件
        fs.unlinkSync(url)
      } else {
        // 当前为文件夹，则递归调用自身
        arguments.callee(url)
      }
    })
    // 删除空文件夹
    fs.rmdirSync(p)
  }
  
function delAllDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
            files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            }
             else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
    }
}
if(!flag){
    // 删除指定文件
    delDir(fileNamePth) 
}else{
    // 删除文件夹下所有子文件
    delAllDir(fileNamePth) 
}
