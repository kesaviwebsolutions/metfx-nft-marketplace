import React, { useState, useEffect } from "react";
import tier1 from "../assets/videos/watch-2-earn-bronze.mp4";
import tier2 from "../assets/videos/watch-2-earn-silver.mp4";
import tier3 from "../assets/videos/watch-2-earn-gold.mp4";
import "./w2enft.css";
import { MintTier1, MintTier2, MintTier3, SaleActive, isWhitelisted1, isWhitelisted2, isWhitelisted3, NFTBal, MintTier1MX, MintTier2MX, MintTier3MX, Metafxbal, totalNFT1 } from "../Web3/ContractMethods";
import { getBal } from "../Web3/Web3Methods";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

const error =(msg)=> toast.error(msg);

export default function W2ENFTs() {
  const [alert, setAlert] = useState(false);
  const [alert2, setAlert2] = useState(false);
  const [alert3, setAlert3] = useState(false);
  const [white1, setWhite1] = useState(true);
  const [white2, setWhite2] = useState(true);
  const [white3, setWhite3] = useState(true);
  const [saleactive, setSateactive] = useState(false);
  const [balance, setBalance] = useState(0);
  const [nftbalance, setNFTbalance] = useState(0);
  const [bnb, setBNB] = useState(0);
  const [metfx, setMETFX] = useState(0);
  const [metfxtoken, setMETFXToken] = useState(0);
  const [totalsupply, setTotalSupply] = useState({one:0,two:0,three:0})

  useEffect(() => {
    const init =async()=>{
      const data1 = await isWhitelisted1();
      const data2 = await isWhitelisted2();
      const data3 = await isWhitelisted3();
      const mfxtoken = await Metafxbal();
      const sale = await SaleActive();
      const bal = await getBal();
      const nftbala = await NFTBal();
      const tier1 = await totalNFT1(0);
      const tier2 = await totalNFT1(1);
      const tier3 = await totalNFT1(2);
      setTotalSupply({one:tier1,two:tier2,three:tier3})
      setNFTbalance(nftbala)
      setBalance(bal)
      setSateactive(sale);
      setWhite1(data1);
      setWhite2(data2);
      setWhite3(data3);
      setMETFXToken(mfxtoken)
      console.log("Metfx balance",mfxtoken)
    }
    init();
    apicall();
  }, [])

  const apicall =async()=>{
    axios.get("https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd").then((res)=>{
      // console.log(res)
      setBNB(res.data.binancecoin.usd)
    }).catch((e)=>[
      console.log(e)
    ])

    axios.get("https://api.pancakeswap.info/api/v2/tokens/0x6266a18F1605DA94e8317232ffa634C74646ac40").then((res)=>{
      console.log(res)
      setMETFX(Number(res.data.data.price).toFixed(5))
    }).catch((e)=>[
      console.log(e)
    ])
  }
  
  const init2 =async()=>{
    const data1 = await isWhitelisted1();
    const data2 = await isWhitelisted2();
    const data3 = await isWhitelisted3();
    const mfxtoken = await Metafxbal();
    const sale = await SaleActive();
    const bal = await getBal();
    const nftbala = await NFTBal();
    setNFTbalance(nftbala)
    setBalance(bal)
    setSateactive(sale);
    setWhite1(data1);
    setWhite2(data2);
    setWhite3(data3);
    setMETFXToken(mfxtoken)
    console.log("Metfx balance",mfxtoken)
  }

  const mint1 =async()=>{
    if(!saleactive){
      error("Sale not Active")
      return true
    }
    if(!white1){
      error("Not WhiteListed for this tier")
      return true
    }
    if(window.currceny == 0){
      if(metfxtoken < 50){
        error("Not enough MFX balance")
        return true
      }
      const data = await MintTier1MX(metfx);
      if(data.status){
       await init2();
      }
    }
    if(window.currceny == 1){
      if(balance < 0.19){
        error("Not enough balance")
        return true
      }
      const data = await MintTier1(bnb);
      if(data.status){
        await init2();
       }
    }
   
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
   
    if(window.currceny == 0){
      if(metfxtoken < 50){
        error("Not enough MFX balance")
        return true
      }
      const data = await MintTier2MX(metfx);
      if(data.status){
        await init2();
       }
    }
    if(window.currceny == 1){
      if(balance < 0.37){
        error("Not enough balance")
        return true
      }
      const data = await MintTier2(bnb);
      if(data.status){
        await init2();
       }
    }
 
  }



  const mint3 =async()=>{
    if(!saleactive){
      error("Sale not Active")
      return true
    }
    if(!white3){
      error("Not WhiteListed for this tier")
      return true
    }
  
    if(window.currceny == 0 ){
      if(metfxtoken < 50){
        error("Not enough MFX balance")
        return true
      }
      const data = await MintTier3MX(metfx);
      if(data.status){
        await init2();
       }
    }
    if(window.currceny == 1){
      if(balance < 0.37){
        error("Not enough balance")
        return true
      }
      const data = await MintTier3(bnb);
      if(data.status){
        await init2();
       }
    }
   
  }

  return (
    <div className="tf-section w2Etier" style={{ backgroundColor: "#101017" }}>
      <Toaster />
      <div className="themesflat-container" style={{ padding: "50px 0px" }}>
        <h2 style={{ paddingLeft: "15px" }}>W2E MEMBER NFTs</h2>
        <div className="row" style={{ padding: "50px 15px 0px 15px" }}>
          <div className="col-lg-4">
            <video src={tier3} autoPlay muted loop className="w-100"></video>
            <div className="d-flex justify-content-around mb-4">
              <p>Total Minted</p>
              <p>{totalsupply.one}</p>
            </div>
            <button
              className="mintBtn"
              onClick={() => {
                mint1();
              }}
        
            >
              {window.address ? (white1 ? (nftbalance > 0 ? 'Minted' : 'Mint Tier 1') : "You are not whitelisted for this tier!") : 'Connect Wallet'}
            </button>
          </div>
          <div className="col-lg-4">
            <video src={tier2} autoPlay muted loop className="w-100"></video>
            <div className="d-flex justify-content-around mb-4">
              <p>Total Minted</p>
              <p>{totalsupply.two}</p>
            </div>
            <button
              className="mintBtn"
              onClick={() => {
                mint2();
              }}
              
            >
               {window.address ? (white2 ? (nftbalance > 0 ? 'Minted' : 'Mint Tier 2') : "You are not whitelisted for this tier!") : 'Connect Wallet'}
            </button>
          </div>
          <div className="col-lg-4">
            <video src={tier1} autoPlay muted loop className="w-100"></video>
            <div className="d-flex justify-content-around mb-4">
              <p>Total Minted</p>
              <p>{totalsupply.three}</p>
            </div>
            <button
              className="mintBtn"
              onClick={() => {
                mint3();
              }}
            
            >
               {window.address ? (white3 ? (nftbalance > 0 ? 'Minted' : 'Mint Tier 3') : "You are not whitelisted for this tier!") : 'Connect Wallet'}
            </button>
          </div>
        </div>
        {nftbalance > 0 && white1 ? (
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
                  Congratulations! You are BRONZE member.
                </strong>
              </div>
              <a href="#" target='_blank'><button className="mintBtn col-lg-4">
                  Open Streaming App 
              </button></a>
            </div>
          </div>
        ) : (
          ""
        )}
        {nftbalance > 0 && white2 ? (
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
                Congratulations! You are SILVER member.
                </strong>
              </div>
              <a href="#" target='_blank'><button className="mintBtn col-lg-4">
                  Open Streaming App 
              </button></a>
            </div>
          </div>
        ) : (
          ""
        )}
        {nftbalance > 0 && white3 ? (
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
                Congratulations! You are GOLD member.
                </strong>
                <a href="#" target='_blank'><button className="mintBtn col-lg-4">
                  Open Streaming App 
              </button></a>
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
