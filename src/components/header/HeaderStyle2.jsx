import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import menus from "../../pages/menu";
import DarkMode from "./DarkMode";
import logodark from "../../assets/images/logo/logo_dark.png";
import avt from "../../assets/images/avatar/avt-2.jpg";
import coin from "../../assets/images/logo/coin.svg";
import BNB from "./../../assets/images/logo/bnb.png";
import MFX from "./../../assets/images/logo/metfx.png"
import { getAccount, CheckChain} from "../../Web3/Web3Methods";
import { VscDebugDisconnect } from "react-icons/vsc"
import { getWeb3 } from "../../Web3/Wallets";
import {RiSwitchFill} from "react-icons/ri"
import { DisconnectWallet, SelectWallet } from "../../Web3/Wallets";
import "./headerStyle.css"

// MUI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { NativeSelect } from "@mui/material";



const HeaderStyle2 = () => {
  const { pathname } = useLocation();

  const headerRef = useRef(null);
  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });

  const [address, setAddress] = useState(undefined);
  useLayoutEffect(() => {
    const init = async () => {
      const wallet = window.localStorage.getItem("Wallet");
      if (wallet == 0) {
        await SelectWallet(0);
        const add = await getAccount();
        slicing(add);
        setAddress(add);
      }
      const id = await CheckChain();
      if(!id){
        alert("Please Switch to Binance Smart Chain");
      }
    };
    init();

    setInterval(async()=>{
       try {
        setAddress(window.address);
       } catch (error) {
        console.log(error)
       }
    },100)

  setInterval(async()=>{
      try {
        const id = await CheckChain();
        const web3 = getWeb3();
        const to = web3.utils.toHex(56);
        // console.log(to)
        if(!id){
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: to }],
          });
        }
      } catch (error) {
       console.log(error);
      }
   },2000)

  }, []);

  try {
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
    window.ethereum.on('accountsChanged', (accounts) => {
      slicing(accounts[0]);
      setAddress(accounts[0]);
      window.address = accounts[0]
    });
  } catch (error) {
    
  }

  const isSticky = (e) => {
    const header = document.querySelector(".js-header");
    const scrollTop = window.scrollY;
    scrollTop >= 300
      ? header.classList.add("is-fixed")
      : header.classList.remove("is-fixed");
    scrollTop >= 400
      ? header.classList.add("is-small")
      : header.classList.remove("is-small");
  };

  const menuLeft = useRef(null);
  const btnToggle = useRef(null);

  const menuToggle = () => {
    menuLeft.current.classList.toggle("active");
    btnToggle.current.classList.toggle("active");
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  const slicing = (address) => {
    const first = address.slice(0, 5);
    const second = address.slice(36);
    return first + "...." + second;
  };

  const DisConnect =async()=>{
    await DisconnectWallet();
    window.localStorage.removeItem("Wallet");
    setAddress(undefined);
  }

  const [open, setOpen] = useState(false);
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    window.currceny = Number(event.target.value)
    console.log(window.currceny,Number(event.target.value))
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <header
      id="header_main"
      className="header_1 header_2 style2 js-header"
      ref={headerRef}
    >
      <div className="themesflat-container">
        <div className="row">
          <div className="col-md-12">
            <div id="site-header-inner">
              <div className="wrap-box flex">
                <div id="site-logo" className="clearfix">
                  <div id="site-logo-inner">
                    <Link to="/" rel="home" className="main-logo">
                      <img id="logo_header" src={logodark} alt="nft-gaming" />
                    </Link>
                  </div>
                </div>
                <div
                  className="mobile-button"
                  ref={btnToggle}
                  onClick={menuToggle}
                >
                  <span></span>
                </div>
                {/* <div className="question-form">
                                    <form action="#" method="get">
                                        <input type="text" placeholder="Type to search..." required />
                                        <button type="submit">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <mask id="mask0_334_638"  maskUnits="userSpaceOnUse" x="1" y="1" width="18" height="17">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.66699 1.66666H17.6862V17.3322H1.66699V1.66666Z" fill="white" stroke="white"/>
                                                </mask>
                                                <g mask="url(#mask0_334_638)">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.67711 2.87312C5.9406 2.87312 2.90072 5.84505 2.90072 9.49903C2.90072 13.153 5.9406 16.1257 9.67711 16.1257C13.4128 16.1257 16.4527 13.153 16.4527 9.49903C16.4527 5.84505 13.4128 2.87312 9.67711 2.87312ZM9.67709 17.3322C5.26039 17.3322 1.66699 13.8182 1.66699 9.49902C1.66699 5.17988 5.26039 1.66666 9.67709 1.66666C14.0938 1.66666 17.6864 5.17988 17.6864 9.49902C17.6864 13.8182 14.0938 17.3322 9.67709 17.3322Z" fill="white"/>
                                                <path d="M9.67711 2.37312C5.67512 2.37312 2.40072 5.55836 2.40072 9.49903H3.40072C3.40072 6.13174 6.20607 3.37312 9.67711 3.37312V2.37312ZM2.40072 9.49903C2.40072 13.4396 5.67504 16.6257 9.67711 16.6257V15.6257C6.20615 15.6257 3.40072 12.8664 3.40072 9.49903H2.40072ZM9.67711 16.6257C13.6784 16.6257 16.9527 13.4396 16.9527 9.49903H15.9527C15.9527 12.8664 13.1472 15.6257 9.67711 15.6257V16.6257ZM16.9527 9.49903C16.9527 5.5584 13.6783 2.37312 9.67711 2.37312V3.37312C13.1473 3.37312 15.9527 6.1317 15.9527 9.49903H16.9527ZM9.67709 16.8322C5.52595 16.8322 2.16699 13.5316 2.16699 9.49902H1.16699C1.16699 14.1048 4.99484 17.8322 9.67709 17.8322V16.8322ZM2.16699 9.49902C2.16699 5.46656 5.52588 2.16666 9.67709 2.16666V1.16666C4.9949 1.16666 1.16699 4.8932 1.16699 9.49902H2.16699ZM9.67709 2.16666C13.8282 2.16666 17.1864 5.46649 17.1864 9.49902H18.1864C18.1864 4.89327 14.3593 1.16666 9.67709 1.16666V2.16666ZM17.1864 9.49902C17.1864 13.5316 13.8282 16.8322 9.67709 16.8322V17.8322C14.3594 17.8322 18.1864 14.1047 18.1864 9.49902H17.1864Z" fill="white"/>
                                                </g>
                                                <mask id="mask1_334_638"  maskUnits="userSpaceOnUse" x="13" y="13" width="6" height="6">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M14.2012 14.2999H18.3333V18.3333H14.2012V14.2999Z" fill="white" stroke="white"/>
                                                </mask>
                                                <g mask="url(#mask1_334_638)">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M17.7166 18.3333C17.5596 18.3333 17.4016 18.2746 17.2807 18.1572L14.3823 15.3308C14.1413 15.0952 14.1405 14.7131 14.3815 14.4774C14.6217 14.2402 15.0123 14.2418 15.2541 14.4758L18.1526 17.303C18.3935 17.5387 18.3944 17.9199 18.1534 18.1556C18.0333 18.2746 17.8746 18.3333 17.7166 18.3333Z" fill="white"/>
                                                <path d="M17.7166 18.3333C17.5595 18.3333 17.4016 18.2746 17.2807 18.1572L14.3823 15.3308C14.1413 15.0952 14.1405 14.7131 14.3815 14.4774C14.6217 14.2402 15.0123 14.2418 15.2541 14.4758L18.1526 17.303C18.3935 17.5387 18.3944 17.9199 18.1534 18.1556C18.0333 18.2746 17.8746 18.3333 17.7166 18.3333" stroke="white"/>
                                                </g>
                                                </svg>
                                        </button>
                                    </form>
                                </div> */}
                <nav id="main-nav" className="main-nav" ref={menuLeft}>
                  <ul id="menu-primary-menu" className="menu">
                    {menus.map((data, index) => (
                      <li
                        key={index}
                        onClick={() => handleOnClick(index)}
                        className={`menu-item ${
                          data.namesub ? "menu-item-has-children" : ""
                        } ${activeIndex === index ? "active" : ""} `}
                      >
                        {data.links.includes("https://") === true ? (
                          <a href={data.links} target="_blank" rel="noreferrer">
                            {data.name}
                          </a>
                        ) : (
                          <Link to={data.links}>{data.name}</Link>
                        )}
                        {data.namesub && (
                          <ul className="sub-menu">
                            {data.namesub.map((submenu) => (
                              <li
                                key={submenu.id}
                                className={
                                  pathname === submenu.links
                                    ? "menu-item current-item"
                                    : "menu-item"
                                }
                              >
                                <Link to={submenu.links}>{submenu.sub}</Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="flat-search-btn flex">
                  {!address ? <div className="sc-btn-top mg-r-12" id="site-header" onClick={()=>DisConnect()}>
                    <Link
                      to="/wallet-connect"
                      className="sc-button header-slider style style-1 wallet fl-button pri-1"
                    >
                      <span>Wallet connect</span>
                    </Link>
                  </div>
                    :
                  <div className="sc-btn-top" id="site-header">
                    <button className="sc-button header-slider style style-1 wallet fl-button pri-1 mb-3" onClick={()=>DisConnect()}>
                      <span>{slicing(address)}</span>
                        {/* <VscDebugDisconnect
                            size={16}
                            style={{ marginLeft: "5px", cursor: "pointer" }}
                        /> */}
                    </button>
                  </div>}

                  {/* <div className="sc-btn-top mb-3" id="" style={{marginLeft:'10px'}}>
                    <div className="switch d-flex align-items-center" onClick={handleClickOpen}>
                        {window.currceny == 0 ? <img src={MFX} width={17}/> : <img src={BNB} height={18}/> }
                    </div>
                  </div> */}

                  {/* <div>
                  <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Select Currency</DialogTitle>
                    <DialogContent>
                      <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 2, minWidth: 120 }} style={{fontSize:'20px'}}>
                   
                          <NativeSelect
                            id="demo-customized-select-native"
                            style={{fontSize:'12px'}}
                            onChange={handleChange}>
                            <option aria-label="None" value=""/>
                            <option value={0}>METFX</option>
                            <option value={1}>BNB</option>
                          </NativeSelect>
                        </FormControl>
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>OK</Button>
                    </DialogActions>
                  </Dialog>
                </div> */}
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DarkMode />
    </header>
  );
};

export default HeaderStyle2;



