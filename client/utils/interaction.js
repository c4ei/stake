import Web3 from "web3";
import sawonABI from '../artifacts/contracts/SaWonToken.sol/SaWonToken.json'
import daeriABI from '../artifacts/contracts/DaeriToken.sol/DaeriToken.json'
import yieldFarmingABI from '../artifacts/contracts/YieldFarming.sol/YieldFarming.json'

// Load web3
export const loadWeb3 = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    return web3;
};

// Load connected wallet
export const loadAccount = async (web3) => {
    const account = await web3.eth.getAccounts();
    return account;
};

// Connect with Sawon Token contract
export const loadSaWonTokenContract = async(web3) =>{
    const network = await web3.eth.net.getId();
    if(network !== process.env.ChainId){
        return null
    }
    const sawonToken = new web3.eth.Contract(sawonABI.abi,process.env.SaWonTokenAddress);
    return sawonToken;
}

// Connect with Daeri Token contract
export const loadDaeriTokenContract = async(web3) =>{
    const network = await web3.eth.net.getId();
    if(network !== process.env.ChainId){
        return null
    }
    const daeriToken = new web3.eth.Contract(daeriABI.abi,process.env.DaeriTokenAddress);
    return daeriToken;
}

// Connect with YieldFarming Token contract
export const loadYieldFarmingContract = async(web3) =>{
    const network = await web3.eth.net.getId();
    if(network !== process.env.ChainId){
        return null
    }
    const yieldFarmingToken = new web3.eth.Contract(yieldFarmingABI.abi,process.env.YieldFarmingAddress);
    return yieldFarmingToken;
}

export const stakeToken = async(farmingContract,daeriContract,address,amount,onSuccess,onError)=>{
    await daeriContract.methods.approve(process.env.YieldFarmingAddress,amount).send({from:address})
    .on('receipt', async function(receipt){

        await farmingContract.methods.stakeToken(amount).send({from:address})
            .on('receipt', function(receipt){
                onSuccess(amount)
            })
            .on('error', function(error){ 
            onError(error.message)
            })
        })

    .on('error', function(error){ 
      onError(error.message)
    })
}


export const unStakeToken = async(farmingContract,address,amount,onSuccess,onError)=>{
    await farmingContract.methods.unStakeToken(amount).send({from:address})
     .on('receipt', function(receipt){
        onSuccess(amount)
      })
     .on('error', function(error){ 
       onError(error.message)
     })
}

export const issueReword = async(farmingContract,address) =>{
    
    await farmingContract.methods.issueReword().send({from:address})
    .on('receipt', function(receipt){
       console.log(receipt)
     })
    .on('error', function(error){ 
      console.log(error.message)
    })
}

export const buyDaeri = async(farmingContract,address,amount,onSuccess,onError) =>{
    console.log(amount)
    await farmingContract.methods.buyDaeri(amount).send({from:address})
    .on('receipt', function(receipt){
        onSuccess(amount)
     })
    .on('error', function(error){ 
        onError(error.message)
    })
}