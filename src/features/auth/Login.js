import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'

import { Form, Col, Button, Alert } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
//------
import { 
  login,
} from './authSlice'
import jeff from './jeff.jpg'
import './login.css'
//------
const schema = yup.object().shape({
  username: yup.string().required('Required'),
  password: yup.string().required('Required'),
})

const Login = () => {
  const dispatch = useDispatch()
  
  const sas = useSelector((state) => state.auth)// sas = store auth states
  const [hae, setH] = useState(true)// hae = hide auth error
  
  const handleLogin = (values) => {
    dispatch(login({ username:values.username, password:values.password }))      
  }
  
  useEffect(() => {
    if (sas.opStatus === 'failed') {
      setH(false)
    }
  }, [sas.opStatus])

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleLogin}
      initialValues={{
        username: '',
        password: '',
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
        <Form noValidate onSubmit={handleSubmit}><br/><br/><br/>
          <div id="login-row" className="row justify-content-center align-items-center">
            <div id="login-column" className="col-md-6">
              <div className="login-box col-md-12">
              
	              <h1 className="text-center text-primary">JLS Portal</h1><br/>
                <h4 className="text-center text-primary">Asano-Gonnella Center for Research in Medical Education & Health Care</h4><br/>
                <img style={{width: "25%"}} src={jeff}/>
                
                <Form.Group controlId="validationFormik01">
                  <Form.Label className="text-primary">Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username && touched.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group controlId="validationFormik02">
                  <Form.Label className="text-primary">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password && touched.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="form-group" style={{"textAlign":"center"}}>
                  <Alert variant='danger' hidden={hae}>
                    Incorrect username or password.
                  </Alert>                  
                  <Button type="submit">Login</Button>
                </div>
                
              </div>
            </div>
          </div>
          
        </Form>        
      )}
    </Formik>//
  )
}

export default Login
