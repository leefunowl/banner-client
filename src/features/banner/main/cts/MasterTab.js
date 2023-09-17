import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'

import { Formik } from 'formik'
import * as yup from 'yup'
import Moment from 'moment' // moment is required for react-datepicker
import DatePicker from "react-datepicker"
import { Form, Row, Col, Button } from 'react-bootstrap'
import "react-datepicker/dist/react-datepicker.css"
//------
import c from '../../../../config'
import InsertModal from '../../BootstrapTableUI/modal'
import {
  selectAllData,
  updateStatus,
  updateRows,
  setStoreData
} from '../../BannerTableSlice'
//------
const go = [{value:1, label:'M'}, {value:2, label:'F'}] // go = gender options
const status_list = ['G', 'T', 'W', 'D', 'X', 'F', 'L', 'S', 'Y', '']
const gender_list = ['M', 'F', '']
const fc_list = ['P', 'I', 'F', 'M', 'N', '']
// backend to frontend boolean convertion
const b2f = { 1:true, true:true, "Y":true, '':false, false:false, null:false, "N":false, 0:false }
const f2b = { true:1, false:0 }
//const del_lu = { 'on':'Y', undefined:'N', }
const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID',
  'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
  'MO', 'MT', 'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK', 'OR', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'AS',
  'DC', 'FM', 'GU', 'MH', 'MP', 'PW', 'PR', 'VI', 'PA', 'NJ', 'NY', ''
]

// goh = gender option handler
const goh = (values) => {
  let g = go.find(i => i.value === values.Gender)
  return g ? g.label : ''
}

export default function MasterTab() {
  const dispatch = useDispatch()
  const storeData = useSelector(selectAllData)[0]

  const [data, setData] = useState(storeData)
  const [ready, setReady] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  // ls = local operation status
  const [ls, setLs] = useState('idle')
  // cs = central operation status
  const cs = useSelector((state) => state.BannerTable.opStatus)
  // store lsd states
  const sls = useSelector((state) => state.BannerTable)

  const handleSave = async (values) => {
    if ( ls === 'idle' ) {
      const convertV = {...values}
      // converting boolean values
      for (const [key, value] of Object.entries(convertV)) {
        if (Array.isArray(value)) {
          convertV[key] = b2f[value[0]]
        }
      }
      
      setLs('updating')
      await dispatch(updateRows({
        table : sls.table,
        id : convertV.id,
        data : convertV,
      }))
    }
  }
  
  const handleInsert = (e) => {
    setModalShow(true)
  }

  useEffect(() => {
    let _data = {...storeData}
    // set flag of "ready" to true once the data came in
    if (Object.keys(_data).length > 1) {
      setReady(true)
    }
    setData(_data)

  }, [storeData])
  
  // update: if backend update succeeded, use local data to update storeData
  useEffect(() => {
    if ( ls === 'updating' && cs === 'succeeded' ) {
      const _ = [{...data}]
      dispatch(setStoreData({ _data : _ }))
      
      alert('Succeeded :)')
      setLs('completed')
    } else if ( ls === 'updating' && cs === 'failed' ) {
      alert('Operation failed. Something is wrong :(')
      setLs('completed')
    }
  }, [ls, cs])
  
  // update local "data" when storeData changes
  useEffect(() => {
    setData(storeData)
  }, [storeData])
  
  // reset operation status for local and central store
  useEffect(() => {
    if ( ls === 'completed' ) {
      setLs('idle')
      dispatch(updateStatus({ _opStatus: 'idle' }))
    }
  }, [ls])

  return ready ? (
    <Formik
      validationSchema={c.master_t_schema}
      initialValues={data}
      enableReinitialize={true}
      onSubmit={handleSave}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
        setFieldValue
      }) => (
        <Form noValidate onSubmit={handleSubmit}>

          <Form.Group controlId="Demography">
            <Form.Label><b>Demography</b></Form.Label>
            <Row>
              <Col>
                <Form.Label>Mastkey</Form.Label>
                <Form.Label>{values.id}</Form.Label>
              </Col>
              <Col>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="Lname"
                  value={values.Lname || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Lname && touched.Lname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Lname}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Middle Initial</Form.Label>
                <Form.Control
                  type="text"
                  name="MI"
                  value={values.MI || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.MI && touched.MI}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.MI}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="Fname"
                  value={values.Fname || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Fname && touched.Fname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Fname}
                </Form.Control.Feedback>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <Form.Group controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={values.Status || ''}
                    onChange={(e) => setFieldValue('Status', e.target.value)}
                  >
                    {status_list.map((s) => {return (<option key={s}>{s}</option>)})}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="gender">
                  <Form.Label>Gender</Form.Label>
                  {/*
                    value={() => {return 'M'}} or value={goh} won't work.
                    "value" is expecting a value, not a function handler.
                    Therefore we need to actually call this function
                    and return the result of this function to "value"
                  */}
                  <Form.Control
                    as="select"
                    value={goh(values) || ''}
                    onChange={(e) => setFieldValue('Gender', go.find(i => i.label === e.target.value).value)}
                  >
                    {gender_list.map((g) => {return (<option key={g}>{g}</option>)})}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="state">
                  <Form.Label>AMA State</Form.Label>
                  <Form.Control
                    as="select"
                    value={values.AMAState || ''}
                    onChange={(e) => setFieldValue('AMAState', e.target.value)}
                  >
                    {states.map((state) => {return (<option key={state}>{state}</option>)})}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="failure_code">
                  <Form.Label>Failure Code</Form.Label>
                  <Form.Control
                    as="select"
                    value={values.FAILURE || ''}
                    onChange={(e) => setFieldValue('FAILURE', e.target.value)}
                  >
                    {fc_list.map((f) => {return (<option key={f}>{f}</option>)})}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <Form.Group controlId="DOB">
                  <Form.Label>Date of Birth</Form.Label>
                  <DatePicker
                    selected={new Date(Moment(values.DOB).add(4, 'hours')) || new Date()}
                    onChange={date => setFieldValue('DOB', Moment(date).add('-4', 'hours').format())}
                  />
                </Form.Group>                
              </Col>
              <Col>
                <Form.Label>Year Deceased</Form.Label>
                <Form.Control
                  type="text"
                  name="Deceased"
                  value={values.Deceased || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Deceased && touched.Deceased}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Deceased}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Ethnicity</Form.Label>
                <Form.Control
                  type="text"
                  name="ETHNIC"
                  value={values.ETHNIC || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.ETHNIC && touched.ETHNIC}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.ETHNIC}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Transfer year</Form.Label>
                <Form.Control
                  type="text"
                  name="Transfer"
                  value={values.Transfer || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Transfer && touched.Transfer}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Transfer}
                </Form.Control.Feedback>
              </Col>
            </Row>
            
            <Row>
              <Col>
                  <Form.Check type="checkbox" label="AOA" name="AOA" onChange={handleChange} checked={b2f[values.AOA] || false}/>
                  <Form.Check type="checkbox" label="Accel" name="Accel" onChange={handleChange} checked={b2f[values.Accel] || false}/>
              </Col>
              <Col>
                  <Form.Check type="checkbox" label="FLEX" name="FLEX" onChange={handleChange} checked={b2f[values.FLEX] || false}/>
                  <Form.Check type="checkbox" label="SGUL" name="SGUL" onChange={handleChange} checked={b2f[values.SGUL] || false}/>
              </Col>
              <Col>
                  <Form.Check type="checkbox" label="Alumni" name="Alumni" onChange={handleChange} checked={b2f[values.Alumni] || false}/>
                  <Form.Check type="checkbox" label="PSAP" name="PSAP" onChange={handleChange} checked={b2f[values.PSAP] || false}/>
              </Col>
            </Row><br/>
            
            <Form.Label><b>Other Info</b></Form.Label>
            <Row>
              <Col>
                <Form.Label>CGS</Form.Label>
                <Form.Control
                  type="text"
                  name="CGS"
                  value={values.CGS || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.CGS && touched.CGS}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.CGS}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Cat</Form.Label>
                <Form.Control
                  type="text"
                  name="Cat"
                  value={values.Cat || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Cat && touched.Cat}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Cat}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Currentstate</Form.Label>
                <Form.Control
                  type="text"
                  name="Currentstate"
                  value={values.Currentstate || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Currentstate && touched.Currentstate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Currentstate}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DEL_BS</Form.Label>
                <Form.Control
                  type="text"
                  name="DEL_BS"
                  value={values.DEL_BS || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DEL_BS && touched.DEL_BS}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DEL_BS}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DEL_CLIN</Form.Label>
                <Form.Control
                  type="text"
                  name="DEL_CLIN"
                  value={values.DEL_CLIN || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DEL_CLIN && touched.DEL_CLIN}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DEL_CLIN}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DEL_COMP</Form.Label>
                <Form.Control
                  type="text"
                  name="DEL_COMP"
                  value={values.DEL_COMP || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DEL_COMP && touched.DEL_COMP}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DEL_COMP}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DEL_GRAD</Form.Label>
                <Form.Control
                  type="text"
                  name="DEL_GRAD"
                  value={values.DEL_GRAD || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DEL_GRAD && touched.DEL_GRAD}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DEL_GRAD}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DEL_MED</Form.Label>
                <Form.Control
                  type="text"
                  name="DEL_MED"
                  value={values.DEL_MED || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DEL_MED && touched.DEL_MED}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DEL_MED}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DEL_NONM</Form.Label>
                <Form.Control
                  type="text"
                  name="DEL_NONM"
                  value={values.DEL_NONM || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DEL_NONM && touched.DEL_NONM}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DEL_NONM}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DEL_OTH</Form.Label>
                <Form.Control
                  type="text"
                  name="DEL_OTH"
                  value={values.DEL_OTH || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DEL_OTH && touched.DEL_OTH}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DEL_OTH}
                </Form.Control.Feedback>
              </Col>
              
            </Row>
            <Row>
              <Col>
                <Form.Label>DEL_PERS</Form.Label>
                <Form.Control
                  type="text"
                  name="DEL_PERS"
                  value={values.DEL_PERS || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DEL_PERS && touched.DEL_PERS}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DEL_PERS}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DP</Form.Label>
                <Form.Control
                  type="text"
                  name="DP"
                  value={values.DP || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DP && touched.DP}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DP}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DegreeKey</Form.Label>
                <Form.Control
                  type="text"
                  name="DegreeKey"
                  value={values.DegreeKey || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DegreeKey && touched.DegreeKey}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DegreeKey}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Dimer</Form.Label>
                <Form.Control
                  type="text"
                  name="Dimer"
                  value={values.Dimer || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Dimer && touched.Dimer}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Dimer}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>DualDeg</Form.Label>
                <Form.Control
                  type="text"
                  name="DualDeg"
                  value={values.DualDeg || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.DualDeg && touched.DualDeg}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.DualDeg}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Homestate</Form.Label>
                <Form.Control
                  type="text"
                  name="Homestate"
                  value={values.Homestate || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Homestate && touched.Homestate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Homestate}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>JEFS</Form.Label>
                <Form.Control
                  type="text"
                  name="JEFS"
                  value={values.JEFS || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.JEFS && touched.JEFS}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.JEFS}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>JMC</Form.Label>
                <Form.Control
                  type="text"
                  name="JMC"
                  value={values.JMC || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.JMC && touched.JMC}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.JMC}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>MDPhDPrg</Form.Label>
                <Form.Control
                  type="text"
                  name="MDPhDPrg"
                  value={values.MDPhDPrg || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.MDPhDPrg && touched.MDPhDPrg}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.MDPhDPrg}
                </Form.Control.Feedback>
              </Col>
              
            </Row>
            <Row>
              <Col>
                <Form.Label>Othname</Form.Label>
                <Form.Control
                  type="text"
                  name="Othname"
                  value={values.Othname || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Othname && touched.Othname}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Othname}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>PriorPhD</Form.Label>
                <Form.Control
                  type="text"
                  name="PriorPhD"
                  value={values.PriorPhD || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.PriorPhD && touched.PriorPhD}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.PriorPhD}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>SLF</Form.Label>
                <Form.Control
                  type="text"
                  name="SLF"
                  value={values.SLF || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.SLF && touched.SLF}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.SLF}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Scholar</Form.Label>
                <Form.Control
                  type="text"
                  name="Scholar"
                  value={values.Scholar || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Scholar && touched.Scholar}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Scholar}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Suffix</Form.Label>
                <Form.Control
                  type="text"
                  name="Suffix"
                  value={values.Suffix || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Suffix && touched.Suffix}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Suffix}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>TJUH</Form.Label>
                <Form.Control
                  type="text"
                  name="TJUH"
                  value={values.TJUH || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.TJUH && touched.TJUH}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.TJUH}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Withdraw</Form.Label>
                <Form.Control
                  type="text"
                  name="Withdraw"
                  value={values.Withdraw || ''}
                  onChange={handleChange}
                  isInvalid={!!errors.Withdraw && touched.Withdraw}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Withdraw}
                </Form.Control.Feedback>
              </Col>
              
            </Row>            

          </Form.Group>

          <Row>
            <Col>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Col>
            <Col>
              <Button variant="primary" onClick={() => handleInsert()}>
                Add New Person
              </Button>
            </Col>
          </Row><br/>
          
          <InsertModal
            show={modalShow}
            onHide={() => setModalShow(false)}
          />

        </Form>
      )}
    </Formik>
  )
  :
  (
    null
  )
}
