import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Row, Col, Form } from 'react-bootstrap'
import cellEditFactory from 'react-bootstrap-table2-editor'
import Select from 'react-select'

import Moment from 'moment'

import Columns from './BootstrapTableUI/columns'
import c from '../../config'

//------ leefun_t_ui functions
const data2formData = (data) => {
  let tempFormData = {}
  data.forEach((row) => Object.entries(row).map(([key, value]) => {tempFormData[row.id.toString() + '-' + key] = value}))
  return (tempFormData)
}

const formData2data = (formData) => {
  let idx = new Set()
  Object.keys(formData).forEach((key) => idx.add(parseInt(key.split('-')[0])))
  idx.forEach(i => idx[i] = {})
  
  Object.keys(formData).forEach((key) => {
    let i = parseInt(key.split('-')[0])
    let col = key.split('-')[1]
    idx[i][col] = formData[key]
  })

  return ([...Object.values(idx)])
}

const getKeyByValue = (dict, value) => {
  const k = Object.keys(dict).find(key => dict[key] === value)
  return k
}
//------ End

//------ Bootstrap table UI
const api2client = (data, table) => {
  data.forEach((row) => {
  
//    Object.keys(row).forEach(f => {
//      if (f.toLowerCase().includes('date')) {
//        row[f] = Moment(row[f]).format('MM-DD-YYYY')
//      }
//    })
  
    row.id = row[c.tMeta[table].pk]
    delete row[c.tMeta[table].pk]
  })
  return data
}

const client2api = (data, table) => {
  const newData = JSON.parse(JSON.stringify(data))
  newData.forEach((row) => {
    row[c.tMeta[table].pk] = row.id
    delete row.id
  })

  return newData
}

//------ Abs = action buttons
const Abs = ({ handleInsert, handleDelete, handleSave, setShowingAlert }) => {
  return (
    <Row md={10} >
      <Col md={0}>
        <Button variant="primary" onClick={() => handleInsert()}>
          Add New record
        </Button>
      </Col>
      <Col md={0}>
        <Button variant="primary" onClick={(e) => handleDelete(e)}>
          Delete selected rows
        </Button>
      </Col>
      <Col md={0}>
        <Button onClick={handleSave}>
          Save changes
        </Button>
      </Col>
    </Row>//
  )
}
//------
const UI_para = (selected, handleOnSelect, handleOnSelectAll, setU, u, sls) =>{
  const columns = Columns()
  
  const selectRow = {
    mode: 'checkbox',
    clickToSelect: false,
    clickToEdit: true,
    selected: selected,
    onSelect: handleOnSelect,
    onSelectAll: handleOnSelectAll
  }
  
  const cellEdit = cellEditFactory({
    mode: 'click',
    blurToSave: true,
    // afterSaveCell is disable in "server side" operation mode
    afterSaveCell: (oldValue, newValue, row, column) => {
      const data = {}
      data[column.dataField] = newValue
      const _ = [...u]
      _.push({
        table : sls.table,
        id : row.id,
        data : data,
      })
      setU(_)
    }
  })
  
  return { columns, selectRow, cellEdit }
}
//------
const CRUD_func = (
  setModalShow, setSelected, selected, los, u, setLos, dispatch,
  updateRows, removeRows, sls
) => {
  const handleInsert = (e) => {
    setModalShow(true)
  }    

  const handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      setSelected([...selected, row.id])
    } else {
      setSelected(selected.filter(x => x !== row.id))
    }
  }

  const handleOnSelectAll = (isSelect, rows) => {
    const ids = rows.map(r => r.id)
    if (isSelect) {
      setSelected(ids)
    } else {
      setSelected([])
    }
  }
  
  const handleSave = async () => {
    if ( los === 'idle' && u.length !== 0 ) {
      setLos('updating')      
      await u.forEach(r => {
        dispatch(updateRows(r))
      })
    }
  }
  
  const handleDelete = async (e) => {
    if ( los === 'idle' && selected.length !== 0 ) {
      setLos('deleting')      
      dispatch(
        removeRows({ids : selected, table : sls.table})
      )
    }
  }
  
  return { handleInsert, handleOnSelect, handleOnSelectAll, handleSave, handleDelete }
}

//------ defSo = default show options
const defSo_func = (secTD) => {
  let defSo = {}
  for (const [key, value] of Object.entries(secTD)) {
    defSo[key] = (value.length > 100) ? false : true
  }
  
  return defSo
}

//------ fs = fields; function to generate fields for insert page
const Fs = ({
  handleChange, errors, touched, values, table
}) => {

  const secTD = useSelector((state) => state.BannerTable.secTD)
  const defSo = defSo_func(secTD)
  const [showOpts, setShowOpts] = useState(defSo)
  
  // For drop down input with too many options (> 100 etc.), the options will only show up
  // if user enters more than 3 characters for search
  const handleInputChange = (typedOption, f) => {
    let so = {...showOpts}
    if ( typedOption.length > 3 ) {
      so[f] = true
      setShowOpts(so)
    }
    else {
      setShowOpts(defSo)
    }
  }
  
  // generate input fields
  const _ = c.tMeta[table].col.map(f => {
    const _label = c.f2l[f] || f
    let content
    
    if (secTD.hasOwnProperty(f)) {
      // drop-down select input field
      const dict = secTD[f]
      content = (
        <div key={f}>
          <Form.Label>{_label}</Form.Label><br/>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            placeholder="type to search ..."
            value={dict.find(i => i.value === values[f]) || null}
            onInputChange = {to => handleInputChange(to, f)}
            onChange={selectedOption => {
              let value
              if (selectedOption === null) {
                value = null
              } else {
                value = selectedOption.value
              }
              let event = { target : {id:f, value:value} }
              handleChange(event)
            }}
            
            id={f}
            options={showOpts[f] ? dict : []}
          /><br/>
        </div>
    )} else {content = (
      <div key={f}>
      {/* text input field */}
        <Form.Label>{_label}</Form.Label>
        
        <Form.Control
          type="textarea"
          id={f}
          name={f}
          onChange={handleChange}
          value={values[f] || ''}
          
          isInvalid={!!errors[f] && touched[f]}
        />

        <Form.Control.Feedback type="invalid">
          {errors[f]}
        </Form.Control.Feedback><br/>
      </div>
    )}
    
    return content
    
  })

  return _
}

export { Abs, UI_para, CRUD_func, Fs, data2formData, formData2data, getKeyByValue, api2client, client2api }
