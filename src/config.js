import * as yup from 'yup'
import mapValues from 'lodash/mapValues'

const config = {

  Time2LogOut : 600,// Log out user from client side after this number of seconds of inactivity

  SearchOptions:['Mastkey', 'Campus Key', 'Name'],
  
  ts : [
    'Master', 'Identifiers', 'AcademicProgress', 'Performance Measures',
    'Specialty Info', 'QuestionnaireAnswers', 'CareerData', 'FacultyAppointments',
    'Notes'
  ],
  
  // table names labels
  ts_l : {
    'AcademicProgress':'Academic Progress',
    'QuestionnaireAnswers':'Q&A', 'CareerData':'Career Data',
    'FacultyAppointments':'Faculty Appointments',
    'Identifiers':'IDs', 'Performance Measures':'Performance',
    'Specialty Info':'Specialty',
  },
  
  // table meta data
  tMeta : {
    Master : {
      pk:'Mastkey',
      col:[
        'Lname', 'MI', 'Fname',
//        'Gender', 'DOB','Currentstate', 'ETHNIC',
//        'PriorPhD', 'DualDeg', 'Withdraw', 'FAILURE', 'AOA', 'Accel', 'Alumni',
//        'Cat', 'MDPhDPrg', 'FLEX', 'SGUL', 'Transfer'
      ],
      longCol:[],
      Mastkey:'Mastkey',
    },
    AcademicProgress : {
      pk: 'EventKey',
      col: ['StartDate', 'InstitutionKey', 'StatusKey', 'TRLevel', 'PrgKey', 'PGY'],
      longCol: ['InstitutionKey'],
      style: {'width' : '1500px'},
      Mastkey:'MastKey',
    },
    QuestionnaireAnswers : {
      pk: 'QAnswerKey',
      col: ['SourceKey', 'QuestKey', 'Answer', 'Year'],
      longCol: [],
      style: {'width' : '500px'},
      Mastkey:'Mastkey',
    },
    CareerData : {
      pk: 'UNIQUE_ID',
      col: ['DataType', 'Value', 'Source', 'Date'],
      Mastkey:'MastKey',
    },
    FacultyAppointments : {
      pk: 'CareerKey',
      col: ['StartDate', 'InstitutionKey', 'DeptKey', 'Status', 'Rank', 'Source', 'VerificationDate'],
      Mastkey:'MastKey',
    },
    Identifiers : {
      pk: 'IDRecordKey',
      col: ['IDTypeKey', 'IDvalue'],
      Mastkey:'Mastkey',
    },
    'Performance Measures' : {
      pk: 'PerformanceMeasureKey',
      col: ['PerformanceTypeKey', 'Value', 'Date', 'Pass/Fail', 'Source', 'CREDIT_HOURS'],
      Mastkey:'Mastkey',
    },
    'Specialty Info' : {
      pk: 'SpecKey',
      col: ['SpecialtyKey', 'StartDate', 'SourceKey', 'MeasureKey'],
      Mastkey:'Mastkey',
    },
    Notes : {
      pk:'Notekey',
      col:['Text', 'DateAdded'],
      Mastkey:'Mastkey'
    },
    class_list : {
      pk:'MASTKEY',
      Mastkey:'MASTKEY'
    }
  },
  
  // f2l = field to label; table column name to label converter
  f2l : {
    InstitutionKey:'Organization',
    StatusKey:'Status',
    StartDate:'Start Date',
    PrgKey:'Program',
    SourceKey:'Source',
    QuestKey:'Question',
    DataType:'Data Type',
    DeptKey:'Department',
    VerificationDate:'Verification Date',
    IDvalue:'ID',
    IDTypeKey:'Type',
    PerformanceTypeKey:'Subject',
    CREDIT_HOURS:'Credit hours',
    SpecialtyKey:'Specialty',
    MeasureKey:'Sub-source',
    Lname:'Last Name',
    MI:'Middle Initial',
    Fname:'First Name',
    Currentstate:'Current state',
    DOB:'Date of Birth',
    DateAdded:'Date',
    Text:'Note',
    TRLevel:'Year',
  },
  
  //------  validation schema
  schema : yup.lazy(obj => yup.object(
    mapValues(obj, (value, key) => {
  //    if (key.includes('DateAdded')) { 
  //      return yup.number().required('Required')
  //      }
  //    if (key.includes('Answer')) { 
  //      return yup.number().required('Required')
  //      }
  //    if (key.includes('idType')) { 
  //      return yup.string().required('Required')
  //      }
  //    if (key.includes('idValue')) { 
  //      return yup.string().required('Required')
  //      }
  //    if (key.includes('createdAt')) { 
  //      return yup.string().required('Required')
  //      }
  //    if (key.includes('updatedAt')) { 
  //      return yup.string().required('Required')
  //      }
    })
  )),
  
  // schema for validating search parameters
  sp_schema : yup.object().shape({
    userInput: yup.string().matches(/^[a-zA-Z0-9]*$/, 'Only Alphanumeric allowed'),
    lName: yup.string().matches(/^[a-zA-Z0-9]*$/, 'Only Alphanumeric allowed'),
    fName: yup.string().matches(/^[a-zA-Z0-9]*$/, 'Only Alphanumeric allowed'),
  }),
  
  master_t_schema : yup.object().shape({
//    DOB: yup.string().matches(/(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/, 'MM/DD/YYYY format'),
  }),

  modalSchema : {
    Master : yup.object().shape({
      Lname: yup.string().required('Required'),
      Fname: yup.string().required('Required'),
    }),
    AcademicProgress : yup.object().shape({
//      PGY: yup.string().required('Required'),
    }),
    QuestionnaireAnswers : yup.object().shape({
//      SourceKey: yup.number().required('Required'),
//      QuestKey: yup.number().required('Required'),
//      Answer: yup.string().required('Required'),
//      Year: yup.number().required('Required'),
    }),
  }
  
}

export default config
