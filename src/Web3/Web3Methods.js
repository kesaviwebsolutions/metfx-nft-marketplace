import { getWeb3 } from './Wallets'

export const loginProcess = async () => {
  try {
    await window.ethereum.enable()
  } catch (err) {
    console.log(err)
  }
}

export const getChain = async () => {
  try {
    let web3 = getWeb3()
    const chainId = await web3.eth.getChainId()
    return chainId
  } catch (error) {
    console.log(error)
  }
}

export const CheckChain = async () => {
  let web3 = getWeb3()
  const chainId = await web3.eth.getChainId()
  if (parseInt(chainId) == 1) {
    return true
  } else {
    return false
  }
}

export const getAccount = async () => {
 try {
    let web3 = getWeb3()
    const account = await web3.eth.getAccounts()
    return account[0]
 } catch (error) {
    console.log(error)
 }
}

export const getContract = async (abi, address) => {
  try {
    let web3 = getWeb3()
    const customeContract = new web3.eth.Contract(abi, address)
    return customeContract
  } catch (error) {
    console.log(error)
  }
}

export const getContract2 = async (abi, address) => {
 try {
    let web3 = getWeb3()
    const customeContract = new web3.eth.Contract(abi, address)
    return customeContract
 } catch (error) {
    console.log(error)
 }
}

export const WebUtils = (amounts) => {
  try {
    const unit = getWeb3()
    const amount = unit.utils.toWei(amounts.toString(), 'ether')
    return amount
  } catch (e) {
    console.log(e)
  }
}

export const toBNB = (amounts) => {
  try {
    const unit = getWeb3()
    const amount = unit.utils.toBN(amounts.toString(), 'ether')
    return amount
  } catch (e) {
    console.log(e)
  }
}

export const getFasFee = () => {
  try {
    const unit = getWeb3()
    const amount = unit.eth.getGasPrice()
    return amount
  } catch (e) {
    console.log(e)
  }
}

export const network_version = () => {
  try {
    const web3 = getWeb3()
    web3.eth.net.getNetworkType().then(console.log)
  } catch (e) {
    console.log(e)
  }
}
