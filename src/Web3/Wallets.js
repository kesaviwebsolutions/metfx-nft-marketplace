import Web3 from "web3/dist/web3.min.js";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { loginProcess } from "./Web3Methods"

let httpProvider = null

var provider = new WalletConnectProvider({
  rpc: {
    56: 'https://bsc-dataseed1.ninicoin.io',
    97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    // ...
  },
  bridge: 'https://bridge.walletconnect.org',
})

export const SelectWallet = async (tab) => {
  let data = undefined
  console.log(tab)
    try{
      if (tab = 0) {
        data = await provider.enable();
        console.log(data)
        httpProvider = provider
        if(data){
          window.provide = true
          console.log(httpProvider,data,window.provide)
        }
        return data[0];
      }
      if(tab = 1){
        httpProvider = window.ethereum
        await loginProcess();
      }
    }
    catch(e){
      //
    }

}
export const DisconnectWallet =async()=>{
    await provider.disconnect();
    httpProvider = null;
}

export const getWeb3 = () => {
  return new Web3(httpProvider);
};

