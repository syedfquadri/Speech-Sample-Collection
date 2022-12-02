import React,{useEffect, useState} from 'react';
import { useReactMediaRecorder } from "react-media-recorder"; 
import { Container, Paper, Typography,Backdrop, Button  } from '@mui/material';
import axios from 'axios';
var FormData = require('form-data');

export default function Recorder(props) {
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ video: false, audio:true, askPermissionOnMount:true });
    const [uploaded, setUploaded] = useState(false)

    const nextPrompt = () => {
        setUploaded(!uploaded);
        // window.location.reload();
        props.handleRefresh()
    }
    const s3uploader = async (file) => {
        await fetch(props.s3url, {
            method: "PUT",
            body: file, 
            headers:{
                "Content-Type": "audio/wav"
            }
        })
    }
    const handleUpload = async () => {
        const audioBlob = await fetch(mediaBlobUrl).then(r => r.blob());
        const audioFile = new File([audioBlob], `test.wav`, { type: "audio/wav" })
        const response = s3uploader(audioFile)
        setUploaded(!uploaded)
    }
  return (

  <div style={{
    display: 'flex',
    justifyContent: 'center',
    flexDirection: "column",
    alignItems: 'center',
    marginBottom:"2em",
    marginTop:"2em"
  }}>
    <p style={{fontFamily:"courier", fontSize:"11px"}}>Recorder is <b>{status}</b> </p>
    <div>
    {status==="recording" ?
        <Button variant="outlined" onClick={stopRecording} style={{marginLeft:"10px", marginRight:"10px", cursor:"pointer"}}>Stop</Button>
        :
        <Button variant="outlined" color="error" onClick={startRecording} style={{marginLeft:"10px", marginRight:"10px", cursor:"pointer"}}>Record</Button>
    }
    {status==="stopped" &&
        <Button variant="contained" color="success" onClick={handleUpload} style={{marginLeft:"10px", marginRight:"10px", cursor:"pointer"}}>Upload</Button>
    }
    </div>
    <div>
        {status==="stopped" && 
        <audio style={{marginTop:"15px", marginBottom:"0px",border:"red"}} src={mediaBlobUrl} controls></audio>
        }
    </div>
    <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={uploaded}
            onClick={()=>{nextPrompt()}}>
            <Paper elevation={0} variant="outlined" style={{justifyContent:"center", alignItems:'center',padding:"2em",backgroundColor:"#A5F1E9",borderRadius:"8px"}}>
            <Typography variant='caption' align='center' style={{color:"#111436"}}>
                <h2>Upload Successful !</h2>
            </Typography>
            </Paper>
    </Backdrop>
</div>
  )
}
