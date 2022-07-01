import React from "react";
import tier1 from '../assets/videos/watch-2-earn-bronze.mp4'
import tier2 from '../assets/videos/watch-2-earn-silver.mp4'
import tier3 from '../assets/videos/watch-2-earn-gold.mp4'

export default function W2ENFTs() {
  return (
    <div className="tf-section w2Etier" style={{ backgroundColor: "#101017" }}>
      <div className="themesflat-container" style={{ padding: "50px 0px" }}>
        <h2 style={{paddingLeft:"15px"}}>W2E MEMBER NFTs</h2>
        <div className="row" style={{ padding: "50px 15px 0px 15px"}} >
            <div className="col-lg-4">
                <video src={tier3} autoPlay muted loop className="w-100"></video>
            </div>
            <div className="col-lg-4">
                <video src={tier2} autoPlay muted loop className="w-100"></video>
            </div>
            <div className="col-lg-4">
                <video src={tier1} autoPlay muted loop className="w-100"></video>
            </div>
        </div>
      </div>
    </div>
  );
}
