const fs = require('fs')
const ROOT_PATH = process.cwd()
const SOURCES_PATH = ROOT_PATH + '/src/pages'
const TARGET_PATH = ROOT_PATH + '/src/.cache/modules'
const log = text => console.log(`${text}  -------`)

const writeModules = () => {
  let files = fs.readdirSync(SOURCES_PATH)
  files = files.filter(_ => _.indexOf('.') == -1)

  files.forEach(name => {
    const text = `
import controller from '@src/pages/${name}/index.controller'

const mod = angular.module('${name}.module', [])
mod.controller('${name}.ctrl', controller)
export default mod
  `

    fs.writeFileSync(`${TARGET_PATH}/index.${name}.js`, text)
    log(`[模块自动生成]：更新 ${TARGET_PATH}/index.${name}.js 成功`)
  })
}

module.exports = { writeModules }
