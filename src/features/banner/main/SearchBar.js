import React from 'react'
import { useDispatch } from 'react-redux'

import { Formik } from 'formik'
import * as yup from 'yup'

import { Form, Row, Col, Button } from 'react-bootstrap'
//------
import c from '../../../config'
import { 
  search,
  updateMastkey,
} from '../BannerTableSlice'
//------
const SearchBar = () => {

  const dispatch = useDispatch()

  const Search = async (values) => {
    let para = {}
    if (values.searchKey === 'Name') {
      para['Name'] = {
        'lName' : values.lName,
        'fName' : values.fName,
      }
    } else {
      para[values.searchKey] = values.userInput
    }
    await dispatch(search(para))    
  }

  return (
    <Formik
      validationSchema={c.sp_schema}
      onSubmit={Search}
      initialValues={{
        searchKey:'Mastkey',
        userInput: '',
        lName: '',
        fName: ''
      }}
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

          <Form.Row>
            <Form.Group as={Col} md="6" controlId="validationFormik03">
              {/* SearchBar title */}
              <Form.Label>Search By</Form.Label>
              
              {/* drop-down input for selecting the type of search parameters (Mastkey, Campus Key etc.) */}
              <Form.Control
                as="select"
                name="searchKey"
                value={values.searchKey}
                onChange={e => {
                  handleChange(e)
                  dispatch(updateMastkey({ _Mastkey: null }))
                }}
              >
                {c.SearchOptions.map(option => <option key={option}>{option}</option>)}
              </Form.Control><br/>
              
              {/* conditional render for search method */}
              {values.searchKey !== 'Name' ?
              (
              <>
                {/* Input field for "Mastkey" or "Campus Key" */}
                <Form.Control
                  type="text"
                  placeholder=""
                  name="userInput"
                  value={values.userInput}
                  onChange={handleChange}
                  isInvalid={!!errors.userInput && touched.userInput}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.userInput}
                </Form.Control.Feedback>
              </>
              )
              :
              (
              <>
                {/* Input field for "Name" */}
                <Row md={10} >
                  {/* Input field for "Last Name" */}
                  <Col md={0}>
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      name="lName"
                      value={values.lName}
                      onChange={handleChange}
                      isInvalid={!!errors.lName && touched.lName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lName}
                    </Form.Control.Feedback>
                  </Col>
                  {/* Input field for "First Name" */}
                  <Col md={0}>
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      name="fName"
                      value={values.fName}
                      onChange={handleChange}
                      isInvalid={!!errors.fName && touched.fName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fName}
                    </Form.Control.Feedback>
                  </Col>
                </Row>
              </>
              )
              }
            </Form.Group>

          </Form.Row>

          {/* Search button + buttons to switch between react-bs-table UI and Leefun's table UI */}
          <Row md={10} >
            <Col md={0}>
              <Button type="submit">Search</Button>
            </Col>
          </Row>

        </Form>
      )}
    </Formik>//
  )
}

export default SearchBar
