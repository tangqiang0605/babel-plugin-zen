import pluginTester from 'babel-plugin-tester'
import HoistCommonString from '../src/index'

pluginTester({
  plugin: HoistCommonString,
  tests: {
    'using jest snapshots': {
      code: `setTimeout(()=>{},2);setTimeout(()=>{},2);setTimeout(()=>{},2)
      
      `,
      snapshot: true,
    },
  },
})
