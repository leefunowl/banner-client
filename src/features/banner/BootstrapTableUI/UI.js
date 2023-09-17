import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory from 'react-bootstrap-table2-filter'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import paginationFactory from 'react-bootstrap-table2-paginator'
//------
import {
  selectAllData,
  updateStatus,
  setStoreData,
  fetch
} from '../BannerTableSlice'
//------
const { SearchBar } = Search

const UI = ({
  columns,
  cellEdit,
  selectRow,
  los,
  setLos,
  u,
  setU
}) => {
  const dispatch = useDispatch()
  
  // store lsd states
  const sls = useSelector((state) => state.lsdPriTs)
  const storeData = useSelector(selectAllData)
  
  // pn = page #
  const [pn, setPn] = useState(1)
  // spp = size per page
  const [spp, setSpp] = useState(10)
  // sf = sortField
  const [sf, setSf] = useState(null)
  // so = sortOrder
  const [so, setSo] = useState('desc')
  // fp = filter parameter
  const [fp, setFp] = useState(null)
  // up = update parameter
  const [up, setUp] = useState(null)
  
  const [data, setData] = useState(JSON.parse(JSON.stringify(storeData)))
  const [para, setP] = useState(null)
  
  const onTableChange = (type, {
    page,
    sizePerPage,
    sortField,
    sortOrder,
    filters,
    data,
    cellEdit
  }) => {
    
    switch (type) {
      case 'pagination':
        setPn(page)
        setSpp(sizePerPage)
        break
      case 'sort':
        setSf(sortField)
        setSo(sortOrder)
        break
      case 'filter':
        setFp(filters)
        setPn(1)// after seting filter parameter for server side operation,
        //reset page # to 1
        break
      case 'cellEdit':
        const { rowId, dataField, newValue } = cellEdit
        // update local data object
        const result = data.map((row) => {
          if (row.id === rowId) {
            const newRow = { ...row }
            newRow[dataField] = newValue
            return newRow
          }
          return row
        })
        setData(result)
        setUp({ rowId, dataField, newValue })        
        break
    }

  }
  
  // update the tracker of updated rows
  // The reason of having a hook for this: if below was added into
  // onTableChange (cellEdit), only latest edit will be saved in tracker.
  // Maybe it's because onTableChange is async.
  useEffect(() => {
    if (up) {      
      const ur = {}// ur = updated row
      ur[up.dataField] = up.newValue
      const _ = [...u]
      _.push({
        table : sls.table,
        id : up.rowId,
        data : ur,
      })
      setU(_)
    }
  }, [up])
  
  // update: if backend update succeeded, use local data to update storeData
  useEffect(() => {
    if ( los === 'updating' && sls.opStatus === 'succeeded' ) {
      const _ = [...data]// storeData should be data (old data object)
      dispatch(setStoreData({ _data:_ }))
      
      alert('Succeeded :)')
      setLos('completed')
    } else if ( los === 'updating' && sls.opStatus === 'failed' ) {
      alert('Operation failed. Something is wrong :(')
      setLos('completed')
    }
  }, [los, sls.opStatus])
  
  useEffect(() => {
    if (sls.mode === 'server') {
      dispatch(fetch({
        table : sls.table,
        where : { Mastkey:sls.Mastkey },
        pn : pn,
        spp : spp,
        sf : sf,
        so : so,
        fp : fp,
      }))
    }
  }, [pn, spp, sf, so, fp])
  
  // update parameters for either client or sever side operation
  useEffect(() => {
    let _para

    switch (sls.mode) {
      case 'client':
        _para = {
          pagination : paginationFactory(),
        }
        
        break
        
      case 'server':// when tnr > threshold or mode === 'filter' in backend       
        _para = {
          remote : true,
          pagination : paginationFactory({ page:pn, sizePerPage:spp, totalSize:sls.tnr }),
          onTableChange : onTableChange,
        }
        
        break
    }
    
    setP(_para)
    
  }, [sls.mode, sls.data, pn, spp, sls.tnr])

  useEffect(() => {
    setData(JSON.parse(JSON.stringify(storeData)))
  }, [storeData])
  
  return para ? (
    <ToolkitProvider
      keyField = 'id'
      data = { data }
      columns = { columns }
      search={ { searchFormatted: true } }
    >
      {
        props => (
          <div>
            {/*
              The feature of filtering rows by searching key word across
              ALL columns is only
              available for client side. Server side of this feature will
              be too complicated to implement and consume too much sources
              of the server. Not worthy.
            */}
            {sls.mode === 'client' ? <SearchBar { ...props.searchProps } /> : null}
            <hr />
            <BootstrapTable
              { ...props.baseProps }
              { ...para }
              filter = { filterFactory() }
              cellEdit = { cellEdit }
              selectRow = { selectRow }
              bootstrap4
            />
          </div>
        )
      }
    </ToolkitProvider>
  )
  :
  null
}

export { UI }
