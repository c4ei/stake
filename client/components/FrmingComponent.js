import React from 'react'
import Image from 'next/image';
import tether from '../public/tether.svg'

const FarmingComponent = () => {
  return (
    <div className='farming-container self-center m-2 lg:m-0'>
        <h1 className='text-xl text-white font-bold'>Brownie Yield Farm</h1>
        <div className='flex justify-between pt-1'>
            <p className='text-sm text-white'><strong className='font-bold'>Wallet balance :</strong> 100 ETH</p>
            <p className='text-sm text-white font-bold w-20 lg:w-40 truncate'>0x495f264d1c096D55ef3f2.....</p>
        </div>

        <div className='flex justify-between pt-6 lg:pt-12'>
            <div className='p-3 bg-[#72737D] w-2/5 rounded-md'>
                <p className='text-white'><strong className='font-bold'>Staking balance</strong> 100</p>
            </div>
            <div className='p-3 bg-[#72737D] w-2/5 rounded-md'>
                <p className='text-white'><strong className='font-bold'>Reword balance </strong> 100</p>
            </div>
        </div>

        <div className="flex flex-row pt-6">
            <input type="number" placeholder="Type here" className="input rounded-l-md" />
            <span className="input-btn-label flex items-center justify-center" >
                <Image src={tether} width={30} height={30} alt="tether image"/>
                <p className='font-white font-bold'>Tether</p>
            </span>
        </div>

        <button className='stake'>STAKE</button>
        <button className='un-stake'>UN-STAKE</button>

    </div>

  )
}

export default FarmingComponent