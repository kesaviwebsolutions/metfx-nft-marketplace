import React, { useState } from "react";
import tier1 from "../assets/videos/watch-2-earn-bronze.mp4";
import tier2 from "../assets/videos/watch-2-earn-silver.mp4";
import tier3 from "../assets/videos/watch-2-earn-gold.mp4";
import "./w2enft.css";

export default function W2ENFTs() {
  const [alert, setAlert] = useState(false);
  const [alert2, setAlert2] = useState(false);
  const [alert3, setAlert3] = useState(false);

  const ShowAlert = () => {
    setAlert(!alert);
    setAlert2(!alert2);
    setAlert3(!alert3);
    console.log(alert);
  };

  return (
    <div className="tf-section w2Etier" style={{ backgroundColor: "#101017" }}>
      <div className="themesflat-container" style={{ padding: "50px 0px" }}>
        <h2 style={{ paddingLeft: "15px" }}>W2E MEMBER NFTs</h2>
        <div className="row" style={{ padding: "50px 15px 0px 15px" }}>
          <div className="col-lg-4">
            <video src={tier3} autoPlay muted loop className="w-100"></video>
            <button
              className="mintBtn"
              onClick={() => {
                ShowAlert();
                setAlert2(false);
                setAlert3(false);
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
                ShowAlert();
                setAlert(false);
                setAlert3(false);
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
                ShowAlert();
                setAlert(false);
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
                  Minted Successfully For Tier1
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
                  Minted Successfully For Tier2
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
                  Minted Successfully For Tier3
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
