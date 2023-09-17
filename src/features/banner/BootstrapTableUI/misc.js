//////
//  // tnr = total # of records
//  const [tnr, setTnr] = useState(sls.tnr)
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
//////
//  const handleTableChange = (type, {
//    page,
//    sizePerPage,
//    sortField,
//    sortOrder,
//    filters
//  }) => {
//    
//    switch (type) {
//      case 'pagination':
//        setPn(page)
//        setSpp(sizePerPage)
//        break
//      case 'sort':
//        setSf(sortField)
//        setSo(sortOrder)
//        break
//      case 'filter':
//        setFp(filters)
//        break
//    }

//  }
  
//  useEffect(() => {
//    dispatch(fetch({
//        table : sls.table,
//        where : {Mastkey: sls.Mastkey},
//        pn : pn,
//        spp : spp,
//        sf : sf,
//        so : so,
//        fp : fp,
//    }))
//  }, [pn, spp, sf, so, fp])
//////
//  const para = {
//    remote : rp,
//    pagination : paginationFactory(pp),
//    onTableChange : cp,
//  }
  
//  useEffect(() => {
//    if (ls.mode === 'client') {
//    
//    } else if (ls.mode === 'server') {
//    
//    }
//  }, [ls.mode])
