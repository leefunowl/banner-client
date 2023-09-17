import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Modal, Button, Form } from 'react-bootstrap'

import { Formik } from 'formik'
import Moment from 'moment'

import config from '../../../config' // c = config
import { client2api, Fs } from '../util'
import {
  selectAllData,
  insertRows,
  updateStatus,
  insertStoreData,
  updateMaxIdx,
} from '../BannerTableSlice'

const InsertModal = (props) => {
  const dispatch = useDispatch()

  const Mastkey = useSelector((state) => state.lsdPriTs.Mastkey)
  const table = useSelector((state) => state.lsdPriTs.table)
  const maxIdx = useSelector((state) => state.lsdPriTs.maxIdx)
  // cos = central operation status
  const cos = useSelector((state) => state.lsdPriTs.opStatus)

  // los = local operation status
  const [los, setLos] = useState('idle')
  // td = temp data
  const [td, setTD] = useState(null)
  // iv = initialValues
  const [iv, setIV] = useState({})

  const handleSave = (values, { resetForm }) => {
    setTD([values])
    let _ = client2api([values], table)
    
    if ( los === 'idle' ) {
      setLos('inserting')      
      dispatch(
        insertRows({ data : _, table : table, Mastkey : Mastkey })
      )
    }
//    resetForm({})
  }

  // reset initial record values when the previous record got updated into DB successively
  // this is triggered by the updated "maxIdx"
  useEffect(() => {
    const _ = {...iv}
    config.tMeta[table].col.forEach((f) => {
      _[f] = null
    })

    _['id'] = maxIdx + 1
    _[config.tMeta[table].Mastkey] = Mastkey
    _['DateAdded'] = new Date() // Moment(new Date()).format('MM-DD-YYYY')

    setIV(_)
  }, [maxIdx])               

  // if new record got inserted into DB successively, update storeData and maxIdx
  useEffect(() => {
    if ( los === 'inserting' && cos === 'succeeded' ) {
      dispatch(insertStoreData({ _insert : td }))
      dispatch(updateMaxIdx())
      alert('Succeeded :)')
      setLos('completed')
    } else if ( los === 'inserting' && cos === 'failed' ) {
      alert('Operation failed. Something is wrong :(')
      setLos('completed')
    }
  }, [los, cos])
  
  // reset operation status for local and store
  useEffect(() => {
    if ( los === 'completed' ) {
      setLos('idle')
      dispatch(updateStatus({ _opStatus: 'idle' }))
    }
  }, [los])
  
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add a new record
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Formik
          initialValues={iv}
          enableReinitialize
          validationSchema={config.modalSchema[table]}
          onSubmit={handleSave}
        >
          {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isValid,
              errors,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>

                <Form.Group>
                  <Fs
                    handleChange={handleChange}
                    errors={errors}
                    touched={touched}
                    values={values}
                    table={table}
                  />                  
                  <Button type="submit" className="mb-2">
                      Save record
                  </Button>
                  
                </Form.Group>
                
              </Form>
            )}
        </Formik>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InsertModal
