import React  from 'react';
import HeaderStyle2 from '../components/header/HeaderStyle2';
import Footer from '../components/footer/Footer';
// import Category from '../components/layouts/home-7/Category';
// import LiveAuction from '../components/layouts/home-7/LiveAuction';
// import TopSeller from '../components/layouts/home-7/TopSeller';
import SliderStyle4 from '../components/slider/SliderStyle4';
// import TodayPicks from '../components/layouts/home-7/TodayPicks';
// import Create from '../components/layouts/home-7/Create';
// import VideoNFT from './VideoNFT';
import W2ENFTs from './W2ENFTs';
// import PopularCollection from '../components/layouts/home-7/PopularCollection';

const Home07 = () => {
    return (
        <div className='home-7'>
            <HeaderStyle2 />
            <SliderStyle4 />
            {/* <LiveAuction /> */}
            {/* <Category /> */}
            {/* <TopSeller /> */}
            {/* <Create /> */}
            {/* <VideoNFT/> */}
            <W2ENFTs/>
            {/* <TodayPicks /> */}
            {/* <PopularCollection /> */}
            <Footer />
        </div>
    );
}

export default Home07;
