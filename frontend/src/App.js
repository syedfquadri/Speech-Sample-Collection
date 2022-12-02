import { Container, Paper, Typography,Backdrop  } from '@mui/material';
import React,  { useState, useEffect } from 'react';
import RCTS_logo from './rcts_logo.png'
import IIIT_logo from './iiit_logo.png'
import { Prompt } from './Prompt';
import { Checkbox } from '@mui/material';
// import axios from 'axios';

// axios.defaults.baseURL = process.env.REACT_APP_DEV === "true" ? process.env.REACT_APP_PROXY_DEV : process.env.REACT_APP_PROXY_DEPLOY


function App() {
  const [consent, setConsent] = useState(true)
  let session_consent = sessionStorage.getItem('consent')
  const ConsentClicked = (e) =>{
    e.preventDefault();
    sessionStorage.setItem("consent", "True")
    setConsent(!consent)
  }
  return (
    <div>
      <div style={{justifyContent:"center",display: 'flex',alignItems:'center'}}>
        <a href={'https://rcts.iiit.ac.in/'}>
          <img src={RCTS_logo} style={{maxWidth:"200px", width:"100%"}}></img>
        </a>
        <a href={'https://www.iiit.ac.in/'}>
          <img src={IIIT_logo} style={{maxWidth:"200px",width:"100%"}}></img>
        </a>
      </div>
      <Typography variant='h4' align='center' style={{color:"#111436", marginTop:"15px", fontFamily:"georgia"}}>
        Speech Sample Collection
      </Typography>
    <Container maxWidth="sm" style={{backgroundColor:"white", marginTop:"2em",marginBottom:"2em", paddingTop:"2em", paddingBottom:"2em", borderRadius:"8px", boxShadow:"0 0 10px #e8eaf2"}}>
      {session_consent!="True" && 
      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={consent}
    >
    <Paper elevation={0} variant="outlined" style={{justifyContent:"center", alignItems:'center',padding:"2em",backgroundColor:"#F7F6DC",borderRadius:"8px"}}>
    <Typography variant='caption' align='center' style={{color:"#111436"}}>
        <h1>Informed Consent</h1>
        <p  style={{padding:"5px"}}>All data is collected anonymously and on a voluntary basis. We do not collect any data that can identify the user at a individual level.</p>
        <p style={{padding:"5px"}}>The participation in the study is completely on a voluntary basis and the user may stop at any point of time.</p>
          <div style={{display:"flex",justifyContent:"center", alignItems:'center'}}>
            <Checkbox color="success" onChange={ConsentClicked} />
            <h4>I agree</h4>
          </div>
    </Typography>
    </Paper></Backdrop>}
      <Prompt />
    </Container>
    <div className='footer'>
      <p>
      2022 Copyright, Raj Reddy Center for Technology and Society (RCTS). All rights Reserved.
      </p></div>
    </div>
  );
}

export default App;
