import { useSelector } from 'react-redux'

import { textFilter, selectFilter } from 'react-bootstrap-table2-filter'
import { Type } from 'react-bootstrap-table2-editor'
//------
import config from '../../../config' // c = config
//------
const Columns = () => {
  const table = useSelector((state) => state.lsdPriTs.table)
  const secTD = useSelector((state) => state.lsdPriTs.secTD)
  //fields to show
  const f2s = config.tMeta[table].col

  const c = []
  
  f2s.forEach((f) => {
    c.push({
      dataField: f,
      text: config.f2l[f] || f,
      
      // format drop-down select default raw numeric value into default text label
      formatter: (secTD.hasOwnProperty(f)) ? (cell) => {
        const _ = secTD[f].find(i => i.value === parseInt(cell))
        const d = _ ? _.label : ''
        return `${d}`
      }
      :
      null,
      
      sort: true,
      
      filter: (secTD.hasOwnProperty(f)) ? selectFilter({
        options: secTD[f]//in theory, secTD[f] should be filtered (for both client
        // or server side operation) so that it only
        // contains options for fetched rows, not all the options in DB. But it'll
        // take too much work. Not worthy.
      })
      :
      textFilter(),
      
      // drop-down select input field options
      editor: (secTD.hasOwnProperty(f)) ? {
        type: Type.SELECT,
        options: secTD[f]
      }
      :
      null,
      
      validator: (newValue, row, column, done) => {
        let _ = {}
        _[column.dataField] = newValue
        config.schema.validate(_).then(() => {
          return done()
        }, (err) => {
          return done({valid: false, message: err.errors[0]})
        })
        
        return { async: true }      
      },
            
    })
  })
  
  return c
}

export default Columns
