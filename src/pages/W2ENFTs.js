import React, { useState, useEffect } from "react";
import tier1 from "../assets/videos/watch-2-earn-bronze.mp4";
import tier2 from "../assets/videos/watch-2-earn-silver.mp4";
import tier3 from "../assets/videos/watch-2-earn-gold.mp4";
import "./w2enft.css";
import { MintTier1, MintTier2, MintTier3, SaleActive, isWhitelisted1, isWhitelisted2, isWhitelisted3 } from "../Web3/ContractMethods";
import { getBal } from "../Web3/Web3Methods";
import toast, { Toaster } from 'react-hot-toast';

const error =(msg)=> toast.error(msg);

export default function W2ENFTs() {
  const [alert, setAlert] = useState(false);
  const [alert2, setAlert2] = useState(false);
  const [alert3, setAlert3] = useState(false);
  const [white1, setWhite1] = useState(true)
  const [white2, setWhite2] = useState(true)
  const [white3, setWhite3] = useState(true)
  const [saleactive, setSateactive] = useState(false)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const init =async()=>{
      const data1 = await isWhitelisted1();
      const data2 = await isWhitelisted2();
      const data3 = await isWhitelisted3();
      const sale = await SaleActive();
      const bal = await getBal();
      setBalance(bal)
      setSateactive(sale);
      setWhite1(data1);
      setWhite2(data2);
      setWhite3(data3);
    }

    init();
  }, [])
  
  const mint1 =async()=>{
    if(!saleactive){
      error("Sale not Active")
      return true
    }
    if(!white1){
      error("Not WhiteListed for this tier")
      return true
    }
    if(balance < 0.19){
      error("Not enough balance")
      return true
    }
   const data = await MintTier1();
   setAlert(data.status)
  }


  const mint2 =async()=>{
    if(!saleactive){
      error("Sale not Active")
      return true
    }
    if(!white2){
      error("Not WhiteListed for this tier")
      return true
    }
    if(balance < 0.37){
      error("Not enough balance")
      return true
    }
    const data = await MintTier2()
    console.log(data)
    setAlert2(data.status)
  }

  console.log("alert2",alert2)

  const mint3 =async()=>{
    if(!saleactive){
      error("Sale not Active")
      return true
    }
    if(!white3){
      error("Not WhiteListed for this tier")
      return true
    }
    if(balance < 0.55){
      error("Not enough balance")
      return true
    }
    const data =  await MintTier3()
    setAlert3(data.status)
  }

  return (
    <div className="tf-section w2Etier" style={{ backgroundColor: "#101017" }}>
      <Toaster />
      <div className="themesflat-container" style={{ padding: "50px 0px" }}>
        <h2 style={{ paddingLeft: "15px" }}>W2E MEMBER NFTs</h2>
        <div className="row" style={{ padding: "50px 15px 0px 15px" }}>
          <div className="col-lg-4">
            <video src={tier3} autoPlay muted loop className="w-100"></video>
            <button
              className="mintBtn"
              onClick={() => {
                mint1();
              }}
        
            >
              Mint
            </button>
          </div>
          <div className="col-lg-4">
            <video src={tier2} autoPlay muted loop className="w-100"></video>
            <button
              className="mintBtn"
              onClick={() => {
                mint2();
              }}
              
            >
              Mint
            </button>
          </div>
          <div className="col-lg-4">
            <video src={tier1} autoPlay muted loop className="w-100"></video>
            <button
              className="mintBtn"
              onClick={() => {
                mint3();
              }}
            
            >
              Mint
            </button>
          </div>
        </div>
        {alert ? (
          <div className="row">
            <div className="col-lg-12">
              <div
                className="alert alert-dismissible fade show text-center w-50 d-block mx-auto mt-5 py-3"
                role="alert"
                style={{
                  background:
                    "linear-gradient(-45deg, #E250E5, #4B50E6, #E250E5, #4B50E6)",
                  borderRadius: "25px",
                }}
              >
                <strong style={{ fontSize: "20px" }}>
                  Minted Successfully For Tier 1
                </strong>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {alert2 ? (
          <div className="row">
            <div className="col-lg-12">
              <div
                className="alert alert-dismissible fade show text-center w-50 d-block mx-auto mt-5 py-3"
                role="alert"
                style={{
                  background:
                    "linear-gradient(-45deg, #E250E5, #4B50E6, #E250E5, #4B50E6)",
                  borderRadius: "25px",
                }}
              >
                <strong style={{ fontSize: "20px" }}>
                  Minted Successfully For Tier 2
                </strong>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {alert3 ? (
          <div className="row">
            <div className="col-lg-12">
              <div
                className="alert alert-dismissible fade show text-center w-50 d-block mx-auto mt-5 py-3"
                role="alert"
                style={{
                  background:
                    "linear-gradient(-45deg, #E250E5, #4B50E6, #E250E5, #4B50E6)",
                  borderRadius: "25px",
                }}
              >
                <strong style={{ fontSize: "20px" }}>
                  Minted Successfully For Tier 3
                </strong>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div></div>
      </div>
    </div>
  );
}
