import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Tabs, Tab } from 'react-bootstrap'
//------
import MasterTab from './cts/MasterTab'
import Bs from '../BootstrapTableUI/App'
import c from '../../../config' // c = config
import { 
  fetch,
  updateTable,
  fetchSecTs,
  updateStatus,
} from '../BannerTableSlice'
import { Loading } from '../../../util'
//------
// initialize table components
const init_ts = () => {
  const initTables = {}
  c.ts.forEach((t) => {initTables[t] = Loading()})
  
  return initTables
}

const LsdTabs = () => {

  const dispatch = useDispatch()
  // lsd states (default)
  const ls = useSelector((state) => state.BannerTable)
  
  const [key, setKey] = useState(ls.table)
  const [ready, setReady] = useState(false)
  const initTables = init_ts()
  const [tables, setTables] = useState(initTables)
  
  // fetch 2ry ts data from backend API
  useEffect(() => {
    if (ls.opStatus === 'succeeded') {   
      ls.secTs.map((fk) => {
        if (!ls.secTD.hasOwnProperty(fk)) {
          dispatch(fetchSecTs({fk:fk}))
        }
      })
    }
  }, [ls.opStatus])

  // only set the UI ready when finish fetching both 1ry and 2ry tables
  useEffect(() => {
    // set ready when: 1. 2ry tables fetch completed; or 2. No record found
    if (ls.secTs.length === Object.keys(ls.secTD).length || ls.tnr === 0) {
      setReady(true)
    }
  }, [ls.secTs, ls.secTD, ls.tnr])

  // when both 1ry and 2ry ts data ready, render UI
  useEffect(() => {
    if (ready === true) {
      const newTables = {...initTables}

      if (key === 'Master') {
        // non grid data (Master etc.) + custom tabs, to be added
        newTables[key] = (<MasterTab/>)
        
      } else {
        newTables[key] = (<Bs />)
      }

      setTables(newTables)
      setReady(false)
    }
  }, [ready, key])
  
  // reset ls.opStatus (operation status) to "idle" in store
  useEffect(() => {
    if ( ['succeeded', 'failed'].includes(ls.opStatus) ) {
      dispatch(updateStatus({ _opStatus: 'idle' }))
    }
  }, [ls.opStatus])
  
  return (
    <Tabs
      id="controlled-tab-Filter"
      activeKey={key}
      onSelect={(k) => {
        dispatch(updateTable({ _table : k}))
        dispatch(fetch({
            table : k,
            where : {Mastkey: ls.Mastkey},
            // pn = page #
            pn : 1,
            // spp = records per page
            spp : 10,
        }))
        setKey(k)
      }}
    >
      {
        c.ts.map((t) => {
          return (
            <Tab key={t} eventKey={t} title={c.ts_l[t] || t} disabled={ready}>
              {tables[t]}
            </Tab>
          )
        })
      }
    </Tabs>//
  )
}

export default LsdTabs
