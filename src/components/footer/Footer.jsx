import React, { useState ,useEffect } from 'react';
import { Link } from 'react-router-dom'
import logodark from '../../assets/images/logo/logo_dark.png'
const Footer = () => {
    const accountList = [
        {
            title: "Collection",
            link: "/wallet-connect"
        },
        {
            title: "Create Item",
            link: "/create-item"
        },
    ]
    const resourcesList = [
        {
            title: "Help & Support",
            link: "/help-center"
        },
        {
            title: "Item Details",
            link: "/item-details-01"
        },
    ]
    const companyList = [
        {
            title: "Contact Us",
            link: "/contact"
        },
        {
            title: "FAQ",
            link: "/faq"
        },
    ]
    const socialList = [
        {
            icon: "fab fa-twitter",
            link: "https://twitter.com/metfxmetaverse"
        },
        {
            icon: "fab fa-instagram",
            link: "https://www.instagram.com/metfx.official/"
        },
        {
            icon: "fab fa-telegram-plane",
            link: "https://t.me/METFXWORLD"
        },
        {
            icon: "fab fa-youtube",
            link: "https://www.youtube.com/channel/UCmcIsm2necJGJB7uJDz_e0g"
        },
        {
            icon: "icon-fl-vt",
            link: "https://discord.gg/NAZMfZ3Z"
        },
        

    ]

    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
  
    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
  
      window.addEventListener("scroll", toggleVisibility);
  
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

      
    return (
        <div>
            <footer id="footer" className="footer-light-style clearfix bg-style">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-lg-3 col-md-12 col-12">
                            <div className="widget widget-logo">
                                <div className="logo-footer" id="logo-footer">
                                    <Link to="/">
                                        <img className='logo-dark' id="logo_footer" src={logodark} alt="nft-gaming" />
                                        <img className='logo-light' id="logo_footer" src={logodark} alt="nft-gaming" />
                                        
                                    </Link>
                                </div>
                                <p className="sub-widget-logo">From the comfort of your home, you can watch thousands of movies and enjoy the beauty of the metaverse.</p>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu style-1">
                                <h5 className="title-widget">My Account</h5>
                                <ul>
                                    {
                                        accountList.map((item,index) =>(
                                            <li key={index}><Link to={item.link}>{item.title}</Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-7 col-7">
                            <div className="widget widget-menu style-2">
                                <h5 className="title-widget">Resources</h5>
                                <ul>
                                    {
                                        resourcesList.map((item,index) =>(
                                            <li key={index}><Link to={item.link}>{item.title}</Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                            <div className="widget widget-menu fl-st-3">
                                <h5 className="title-widget">Company</h5>
                                <ul>
                                    {
                                        companyList.map((item,index) =>(
                                            <li key={index}><Link to={item.link}>{item.title}</Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-7 col-12">
                            <div className="widget widget-subcribe">
                                <h5 className="title-widget">Subscribe Us</h5>
                                <div className="form-subcribe">
                                    <form id="subscribe-form" action="#" method="GET" acceptCharset="utf-8" className="form-submit">
                                        <input name="email"  className="email" type="email" placeholder="info@yourgmail.com" required />
                                        <button id="submit" name="submit" type="submit"><i className="icon-fl-send"></i></button>
                                    </form>
                                </div>
                                <div className="widget-social style-1 mg-t32">
                                    <ul>
                                        {
                                            socialList.map((item,index) =>(
                                                <li key={index}><a href={item.link} target="_blank" rel="noreferrer"><i className={item.icon}></i></a></li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {
                isVisible && 
                <Link onClick={scrollToTop}  to='#' id="scroll-top"></Link>
            }
            
            <div className="modal fade popup" id="popup_bid" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div className="modal-body space-y-20 pd-40">
                            <h3>Place a Bid</h3>
                            <p className="text-center">You must bid at least <span className="price color-popup">4.89 ETH</span>
                            </p>
                            <input type="text" className="form-control"
                                placeholder="00.00 ETH" />
                            <p>Enter quantity. <span className="color-popup">5 available</span>
                            </p>
                            <input type="number" className="form-control" placeholder="1" />
                            <div className="hr"></div>
                            <div className="d-flex justify-content-between">
                                <p> You must bid at least:</p>
                                <p className="text-right price color-popup"> 4.89 ETH </p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p> Service free:</p>
                                <p className="text-right price color-popup"> 0,89 ETH </p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p> Total bid amount:</p>
                                <p className="text-right price color-popup"> 4 ETH </p>
                            </div>
                            <Link to="#" className="btn btn-primary" data-toggle="modal" data-target="#popup_bid_success" data-dismiss="modal" aria-label="Close"> Place a bid</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default Footer;
