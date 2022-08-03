//0x73d1D0Ce50D2c380c6Af8c9ead3dBeDE198eB885
import { TierNFT } from "./NFTABI"
import { getAccount, getContract, WebUtils } from "./Web3Methods"
const address = "0x5E79Ef721f49D583e0D3E21673d6aA08dd66DfAF"//" Ropsten 0x7dAA7816780709ab4930C4E0fF9555f1e0cd2c8B"
const tokenaddress = "0x6266a18F1605DA94e8317232ffa634C74646ac40"//" MFX on Ropsten 0x84CaE20B42bE7f0C580F7B0a7E8663fd4Bea7D81"

export const Whitelistfor1 =async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = await contract.methods.bulkWhitelistTier1([await getAccount()],true).send({from:await getAccount()});
        return data;
    } catch (error) {
        console.log(error) 
    }
}

export const Whitelistfor2 =async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = await contract.methods.bulkWhitelistTier2([await getAccount()],true).send({from:await getAccount()});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const Whitelistfor3 =async()=>{
  try {
    const contract = await getContract(TierNFT, address);
    const data = await contract.methods.bulkWhitelistTier3([await getAccount()],true).send({from:await getAccount()});
    return data;
  } catch (error) {
    console.log(error)
  }
}

export const MintTier1 =async(amount)=>{
    try {
        const val = await WebUtils(50/amount)
        const contract = await getContract(TierNFT, address);
        const data = await contract.methods.mintNFT(0).send({from:await getAccount(), value:val});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const MintTier2 =async(amount)=>{
    try {
        const val = await WebUtils(100/amount)
        console.log("allow",val,amount)
        const contract = await getContract(TierNFT, address);
        const data = await  contract.methods.mintNFT(1).send({from:await getAccount(), value:val});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const MintTier3 =async(amount)=>{
    try {
        const val = await WebUtils(150/amount)
        const contract = await getContract(TierNFT, address);
        const data = await  contract.methods.mintNFT(2).send({from:await getAccount(), value:val});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const MintTier1MX =async(amount)=>{
    try {
        const val = await WebUtils(50/amount)
        const allow = await IsApprove();
        console.log("allow for 1", allow)
        if(Number(allow) <= 0 ){
            await Approve();
        }
        const contract = await getContract(TierNFT, address);
        const data = await contract.methods.mintMFX(0,val).send({from:await getAccount()});
        return data;
    } catch (error) {
        console.log(error)
    }
}



export const MintTier2MX =async(amount)=>{
    try {
        const val = await WebUtils(100/amount)
        const allow = await IsApprove();
        console.log("allow",allow)
        if(Number(allow) <= 0 ){
            await Approve();
        }
        const contract = await getContract(TierNFT, address);
        const data = await  contract.methods.mintMFX(1,val).send({from:await getAccount()});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const MintTier3MX =async(amount)=>{
    try {
        const val = await WebUtils(150/amount)
        const allow = await IsApprove();
        console.log("allow",allow)
        if(Number(allow) <= 0 ){
            await Approve();
        }
        const contract = await getContract(TierNFT, address);
        const data = await  contract.methods.mintMFX(2,val).send({from:await getAccount()});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const totalNFT1 =async(id)=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = await contract.methods.tierTotalSupply(id).call();
        return data;
    } catch (error) {
        console.log(error)
    }
}


export const SaleActive = async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = await  contract.methods.saleIsActive().call();
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const isWhitelisted1 = async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = await  contract.methods._whitelistedForTier1(await getAccount()).call();
        console.log("data",data)
        return data;
    } catch (error) {
        console.log(error)
    }
}
export const isWhitelisted2 = async()=>{
  try {
    const contract = await getContract(TierNFT, address);
    const data = await  contract.methods._whitelistedForTier2(await getAccount()).call();
    console.log("data",data)
    return data;
  } catch (error) {
    console.log(error)
  }
}
export const isWhitelisted3 = async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = await  contract.methods._whitelistedForTier3(await getAccount()).call();
        console.log("data",data)
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const NFTBal = async()=>{
    try {
      const contract = await getContract(TierNFT, address);
      const data = await  contract.methods.balanceOf(await getAccount()).call();
      return data;
    } catch (error) {
      console.log(error)
    }
}
export const NFTOWner = async()=>{
    try {
      const contract = await getContract(TierNFT, address);
      const data = await  contract.methods.ownedTokenId(await getAccount()).call();
      return data;
    } catch (error) {
      console.log(error)
    }
}

export const Metafxbal = async()=>{
    try {
        const contract = await getContract(TierNFT, tokenaddress);
        const data = await contract.methods.balanceOf(await getAccount()).call();
        console.log("Bal",data)
        return data;
    } catch (error) {
        console.log(error) 
    }
}

export const Approve = async()=>{
    try {
        const contract = await getContract(TierNFT, tokenaddress);
        const data = await contract.methods.approve(address,115792089237316195423570985008687907853269984665640564039457584007913129639935n).send({from:await getAccount()});
        return data/10**18;
    } catch (error) {
        console.log(error) 
    }
}

export const IsApprove =async()=>{
    try {
        const contract = await getContract(TierNFT, tokenaddress);
        const data = await contract.methods.allowance(await getAccount(), address).call();
        return data;
    } catch (error) {
        console.log(error) 
    }
}