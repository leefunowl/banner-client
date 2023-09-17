import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css'

import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
//------
import SearchBar from './SearchBar'
import LsdTabs from './LsdTabs'
import { 
  fetch,
  updateFound,
  updateMastkey
} from '../BannerTableSlice'
//------
const Main = () => {
  const dispatch = useDispatch()
  // lsd states (default)
  const ls = useSelector((state) => state.BannerTable)
  
  const [content, setContent] = useState(null)
  const [pList, setList] = useState(null)
  
  // hook handle when someone matches the search parameters
  useEffect(() => {
    if (ls.found === true) {
      dispatch(fetch({
          table : ls.table,
          where : {Mastkey: ls.Mastkey},
          // pn = page #
          pn : 1,
          // spp = size per page
          spp : 10,
      }))
      setContent(
        <Row>
          <Col><LsdTabs/></Col>
        </Row>
      )
    } else if (ls.found === false) {
      setContent(
        <><br/>
          <Alert variant='primary'>
            No record found
          </Alert>
        </>
      )
    } 
  }, [ls.found, ls.Mastkey])
  
  // clear content when input field is cleared by user (aka user wants to do another search)
  useEffect(() => {
    if (ls.Mastkey === null) {
        setContent(null)
    }
  }, [ls.Mastkey])
  
  // hook to handle situation when user searches people by name and multiple results return
  useEffect(() => {
    if (ls.multiP !== null) {
      const list = ls.multiP.map((p) => {
        let name = (p.Lname + ', ' + p.Fname + ' ' + p.MI)
        return (
          <Col key={name}>
            <Button
              variant="outline-dark"
              onClick={() => {
                dispatch(updateMastkey({ _Mastkey: p.Mastkey }))
                dispatch(updateFound({ _found: true }))
                setList(null)
              }}
            >
              {name}
            </Button>
          </Col>
        )
      })
      setList(<Row>{list}</Row>)//
    }
  }, [ls.multiP])

  return (
    <Container>
      <Row>
        <Col><SearchBar/></Col>
      </Row>
      {pList}
      {content}
    </Container>
  )
}

export default Main
