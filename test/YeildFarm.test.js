const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) =>{
  return ethers.utils.parseUnits(n,'ether')
}

describe("Yield Farming", function () {
  

    var sawonToken, daeriToken, yieldFarming, owner, investor;
    
    before(async () => {

      [owner, investor] = await ethers.getSigners();

      const SaWonToken = await hre.ethers.getContractFactory("SaWonToken");
      sawonToken = await SaWonToken.deploy();
  
      const DaeriToken = await hre.ethers.getContractFactory("DaeriToken");
      daeriToken = await DaeriToken.deploy();

      const YieldFarming = await hre.ethers.getContractFactory("YieldFarming");
      yieldFarming = await YieldFarming.deploy(sawonToken.address,daeriToken.address);

      // Transfer all Dapp tokens to farm (1 million)
      await sawonToken.transfer(yieldFarming.address, tokens('1000000'))

      // Send tokens to investor
      await daeriToken.transfer(investor.address, tokens('10'), { from: owner.address })

      //Approve & transfer token to yield farming contract
      await daeriToken.transfer(yieldFarming.address, tokens('10'), { from: owner.address })

    })

    describe('Mock DAERI token deployment', async () => {
      it('Name must be Mock DAERI Token', async () => {
        const name = await daeriToken.name()
        expect(name).to.equal("Mock DAERI Token");
      })
    })

    describe('Sawon token deployment', async () => {
      it('Name must be SAWON Token', async () => {
        const name = await sawonToken.name()
        expect(name).to.equal("SAWON Token");
      })
    })

    describe('YieldFarming deployment', async () => {
      it('SAWON Token address must match', async () => {
        const address = await yieldFarming.sawonToken()
        expect(address).to.equal(sawonToken.address);
      })
      it('DAERI Token address must match', async () => {
        const address = await yieldFarming.daeriToken()
        expect(address).to.equal(daeriToken.address);
      })
      it('Contract must have 1000000 sawon token', async () => {
        const balance = await sawonToken.balanceOf(yieldFarming.address)
        expect(balance.toString()).to.equal(tokens('1000000'));
      })
    })

    describe('Yield farming functionality', async () => {
      it('Stake token', async () => {
       const balanceOfInvestorBeforeStaking = await daeriToken.balanceOf(investor.address);
       expect(balanceOfInvestorBeforeStaking.toString()).to.equal(tokens('10'));

       // Approve token
       await daeriToken.connect(investor).approve(yieldFarming.address,tokens('8'))
       // Stake token
       await yieldFarming.connect(investor).stakeToken(tokens('8'))

       const balanceOfInvestorAfterStaking = await daeriToken.balanceOf(investor.address);
       expect(balanceOfInvestorAfterStaking.toString()).to.equal(tokens('2'));

       var investorStakingBalance = await yieldFarming.stakingBalance(investor.address);
       var investorHasStake = await yieldFarming.hasStake(investor.address);
       var investorCurrentStakingStatus = await yieldFarming.currentStakingStatus(investor.address);
       
       expect(investorStakingBalance.toString()).to.equal(tokens('8'));
       expect(investorHasStake).to.equal(true);
       expect(investorCurrentStakingStatus).to.equal(true,"True");

      })

      it('Should failed if reword issuer is not contract owner', async () => {
        await expect(yieldFarming.connect(investor).issueReword()).to.be.revertedWith('You dont have access to perform this operation !');
      })

      it('Issue reword', async () => {
        
        await yieldFarming.connect(owner).issueReword();
        const investorStakingBalance = await yieldFarming.stakingBalance(investor.address);
        const investorRewordBalance = await sawonToken.balanceOf(investor.address);
        expect(investorStakingBalance.toString()).to.equal(investorRewordBalance.toString());

      })

      it('Unstake daeri token', async () => {
        
        await yieldFarming.connect(investor).unStakeToken(tokens('4'));
        const investorContractBalance = await yieldFarming.stakingBalance(investor.address);
        const investorBalance = await daeriToken.balanceOf(investor.address);
        expect(investorContractBalance.toString()).to.equal(tokens('4'));
        expect(investorBalance.toString()).to.equal(tokens('6'));

      })

      it('Buy daeri', async () => {
        
        await yieldFarming.connect(investor).buyDaeri(tokens('2'));
        const investorBalance = await daeriToken.balanceOf(investor.address);
        expect(investorBalance.toString()).to.equal(tokens('8'));

      })

    })

});
