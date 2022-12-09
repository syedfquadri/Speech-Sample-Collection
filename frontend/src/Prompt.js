
import React,  { useState, useEffect } from 'react';
import { Typography, Modal} from '@mui/material';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Recorder from './Recorder';


export const Prompt = () => {
    const [data, setData] = useState({"id":"1234567890","prompt":"Loading Text ..."})
    const [s3url, setS3url] = useState({})
    const handleRefresh = () => {
        window.location.reload()
    }
    useEffect(()=>{
        const fetchData = async () => {
            await axios.get("http://43.205.226.35:8000/get_prompt")
            .then((res) => {
                setData(res.data)
                setS3url({})
            }).catch(err =>{
                    console.log(err)
                })
            }
        fetchData()
        },[])
    useEffect(()=>{
        const getPresignedURL = async () => {
            await axios.get(`http://43.205.226.35:8000/presigned_s3_post/${data.id}`)
            .then((res)=>{
                setS3url(res.data)
            }).catch((err)=>{console.log(err)})

        }
        getPresignedURL()
    },[data])
  return (
    <div style={{marginTop:"1em", marginBottom:"1em",borderRadius:"8px"}}>
        <Paper variant="outlined" style={{justifyContent:"center", alignItems:'center'}}>
            <Typography variant='caption' align='center'>
                <h2>{data.prompt}</h2>
            </Typography>
        </Paper>
        <Recorder s3url={s3url} id={data.id} handleRefresh={()=>{handleRefresh()}}/>
    </div>
  )
}
