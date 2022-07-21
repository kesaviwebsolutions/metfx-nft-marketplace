//0x73d1D0Ce50D2c380c6Af8c9ead3dBeDE198eB885
import { TierNFT } from "./NFTABI"
import { getAccount, getContract } from "./Web3Methods"
const address = "0xB2Ec152878835c89a8f6f8f49ae07097201dFBfd"


export const Whitelistfor1 =async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = contract.methods.bulkWhitelistTier1([await getAccount()],true).send({from:await getAccount()});
        return data;
    } catch (error) {
        console.log(error) 
    }
}

export const Whitelistfor2 =async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = contract.methods.bulkWhitelistTier2([await getAccount()],true).send({from:await getAccount()});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const Whitelistfor3 =async()=>{
  try {
    const contract = await getContract(TierNFT, address);
    const data = contract.methods.bulkWhitelistTier3([await getAccount()],true).send({from:await getAccount()});
    return data;
  } catch (error) {
    console.log(error)
  }
}

export const MintTier1 =async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = contract.methods.mintTier1(0).send({from:await getAccount(), value:'180000000000000000'});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const MintTier2 =async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = contract.methods.mintTier2(1).send({from:await getAccount(), value:'360000000000000000'});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const MintTier3 =async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = contract.methods.mintTier3(2).send({from:await getAccount(), value:'540000000000000000'});
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const SaleActive = async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = contract.methods.saleIsActive().call();
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const isWhitelisted1 = async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = contract.methods._whitelistedForTier1(await getAccount()).call();
        return data;
    } catch (error) {
        console.log(error)
    }
}
export const isWhitelisted2 = async()=>{
  try {
    const contract = await getContract(TierNFT, address);
    const data = contract.methods._whitelistedForTier2(await getAccount()).call();
    return data;
  } catch (error) {
    console.log(error)
  }
}
export const isWhitelisted3 = async()=>{
    try {
        const contract = await getContract(TierNFT, address);
        const data = contract.methods._whitelistedForTier3(await getAccount()).call();
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const NFTBal = async()=>{
    try {
      const contract = await getContract(TierNFT, address);
      const data = contract.methods.balanceOf(await getAccount()).call();
      return data;
    } catch (error) {
      console.log(error)
    }
  }