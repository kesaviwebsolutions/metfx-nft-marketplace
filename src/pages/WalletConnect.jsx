import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderStyle2 from '../components/header/HeaderStyle2';
import Footer from '../components/footer/Footer';
import { SelectWallet } from "./../Web3/Wallets"
import img1 from '../assets/images/icon/connect-1.png'
import { useNavigate } from 'react-router-dom'
// import img2 from '../assets/images/icon/connect-2.png'
// import img3 from '../assets/images/icon/connect-3.png'
import img4 from '../assets/images/icon/connect-4.png'
// import img5 from '../assets/images/icon/connect-5.png'
// import img6 from '../assets/images/icon/connect-6.png'
// import img7 from '../assets/images/icon/connect-7.png'
// import img8 from '../assets/images/icon/connect-8.png'

const WalletConnect = () => {
    const routerHistory = useNavigate();
    const [data] = useState(
        [
            {
                img: img1,
                title: 'Meta Mask',
                Wallet: 0
                // description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt'
            },
            // {
            //     img: img2,
            //     title: 'Bitski',
            //     description: ' Dolor lacinia? Donec nulla, deleniti, dis arcu pharetra maecenas dapibus ante nemo! Wisi?'
            // },
            // {
            //     img: img3,
            //     title: 'Fortmatic',
            //     description: 'Potenti eleifend faucibus quo vero nibh netus suspendisse unde? Consectetuer aspernatur'
            // },
            {
                img: img4,
                title: 'Wallet Connect',
                Wallet: 1
                // description: 'Metus corrupti itaque reiciendis, provident condimentum, reprehenderit numquam, mi'
            },
            // {
            //     img: img5,
            //     title: 'Coinbase Wallet',
            //     description: 'Sollicitudin iure conubia vivamus habitasse aptent, eligendi deserunt excepteur tellus non'
            // },
            // {
            //     img: img6,
            //     title: 'Authereum',
            //     description: 'Purus irure lacinia eiusmod inventore bibendum habitant potenti non sint rem! Felis, asper'
            // },
            // {
            //     img: img7,
            //     title: 'Kaikas',
            //     description: 'Varius culpa, aspernatur accusantium? Corporis rhoncus, voluptatibus incididunt, velit '
            // },
            // {
            //     img: img8,
            //     title: 'Torus',
            //     description: ' Soluta fuga nihil, mollitia, ad reprehenderit qui viverra culpa posuere labore inventore'
            // },
            
        ]
    )

    const Connct_Wallet = async(tab) => {
        await SelectWallet(tab);
        window.localStorage.setItem("Wallet",`${tab}`);
        routerHistory('/');
        // window.location.replace('/')
    }

    return (
        <div>
            <HeaderStyle2 />
            <section className="flat-title-page inner">
                <div className="overlay"></div>
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title-heading mg-bt-12">
                                <h1 className="heading text-center">Connect Wallet</h1>
                            </div>
                            <div className="breadcrumbs style2">
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li>Connect Wallet</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>                    
            </section>
            <div className="tf-connect-wallet tf-section">
                <div className="themesflat-container">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="tf-title-heading ct style-2 mg-bt-12">
                                Connect Your Wallet
                            </h2>
                            <div className="container my-5">
                                <ul style={{fontSize:"18px"}}>
                                    <li style={{lineHeight:"24px"}}>• Tap on 'Connect'</li>
                                    <li style={{lineHeight:"24px"}}>• Select your wallet. (You can select Trust Wallet after tapping on Wallet Connect)</li>
                                    <li style={{lineHeight:"24px"}}>• You'll then be redirected to either 'Trustwallet' or 'Metamask', ensure you change the chain from 'Ethereum' to 'Smartchain'</li>
                                    <li style={{lineHeight:"24px"}}>• You should be able to connect your wallet successfully after following these</li>
                                </ul>
                            </div>
                            {/* <h5 className="sub-title ct style-1 pad-400">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis deleniti asperiores sit.
                            </h5> */}
                        </div>
                        <div className="col-md-12">
                            <div className="sc-box-icon-inner style-2 justify-content-center">
                                {
                                    data.map((item,index) => (
                                        <div key={index} className="sc-box-icon" onClick={()=> Connct_Wallet(item.Wallet)}>
                                            <div className="img">
                                                <img src={item.img} alt="Axies" />
                                            </div>
                                            {/* <h4 className="heading"><Link to="/login">{item.title}</Link></h4> */}
                                            <h4 className="heading">{item.title}</h4>
                                            {/* <p className="content">{item.description}</p> */}
                                        </div>
                                    ))
                                }
                            </div>  
                        </div>    
                    </div>              
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default WalletConnect;
