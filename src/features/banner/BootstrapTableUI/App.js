import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

import './App.css'

import { Abs, UI_para, CRUD_func } from '../util'
import InsertModal from './modal'
import { UI } from './UI'

import {
  selectAllData,
  updateRows,
  removeRows,
  updateStatus,
  setStoreData,
} from '../BannerTableSlice'

const App = () => {
  const dispatch = useDispatch()
  
  const storeData = useSelector(selectAllData)
  // store lsd states
  const sls = useSelector((state) => state.lsdPriTs)
  // cos = central operation status
  const cos = useSelector((state) => state.lsdPriTs.opStatus)

  // los = local operation status
  const [los, setLos] = useState('idle')
  // u = data for update
  const [u, setU] = useState([])
  const [modalShow, setModalShow] = useState(false)
  const [selected, setSelected] = useState([])
  const [isShowingAlert, setShowingAlert] = useState(false)

  const { handleInsert, handleOnSelect, handleOnSelectAll, handleSave, handleDelete } = CRUD_func(setModalShow, setSelected, selected, los, u, setLos, dispatch, updateRows, removeRows, sls)
  const { columns, selectRow, cellEdit } = UI_para(selected, handleOnSelect, handleOnSelectAll, setU, u, sls)

  // reset operation status for local and central store
  useEffect(() => {
    if ( los === 'completed' ) {
      setLos('idle')
      dispatch(updateStatus({ _opStatus: 'idle' }))
    }
  }, [los])
  
  // delete: if backend delete succeeded, take out the deleted rows from
  // local data, then use it to update storeData, then reset "selected"
  useEffect(() => {
    if ( los === 'deleting' && cos === 'succeeded' ) {
      const _ = [...storeData].filter((r) => !selected.includes(r.id))
      dispatch(setStoreData({ _data : _ }))
      
      setSelected([])
      alert('Succeeded :)')
      setLos('completed')
    } else if ( los === 'deleting' && cos === 'failed' ) {
      alert('Operation failed. Something is wrong :(')
      setLos('completed')
    }
  }, [los, cos])

  return (
    <>
      <br/>
      <Abs
        handleInsert = {handleInsert}
        handleDelete = {handleDelete}
        handleSave = {handleSave}
        setShowingAlert = {setShowingAlert}
      />
      <UI
        columns = { columns }
        cellEdit = { cellEdit }
        selectRow = { selectRow }
        los = { los }
        setLos = { setLos }
        u = { u }
        setU = { setU }
      />
      <InsertModal
        show = { modalShow }
        onHide = {() => setModalShow(false)}
      />
    </>//
  )
}

export default App
