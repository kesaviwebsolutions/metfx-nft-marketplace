import React from 'react';
// import { Link } from 'react-router-dom'
import vidNFT1 from '../assets/videos/vidNFT1.mp4'
import vidNFT2 from '../assets/videos/vidNFT2.mp4'

const VideoNFT = () => {
    return (
        <div style={{backgroundColor:"#14141F", paddingTop:"100px"}}>
            <h2 className='text-center mb-5'>MetFx NFTs</h2>
        <div className='row' style={{maxWidth:"1440px", margin:"auto"}}>
            <div className="col-lg-6 my-4 justify-content-center align-items-center d-flex">
                <video src={vidNFT1} style={{maxHeight:"300px",}} autoPlay={true} controls={false} loop muted></video>
            </div>
            <div className="col-lg-6 my-4 justify-content-center align-items-center d-flex">
                <video src={vidNFT2} style={{maxHeight:"300px",}} autoPlay={true} controls={false} loop muted></video>
            </div>
        </div>
        </div>
    );
}

export default VideoNFT;
