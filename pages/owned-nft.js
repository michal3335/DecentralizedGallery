import {ethers} from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import axios from 'axios'
import { nftgalleryaddress, nftaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Gallery from '../artifacts/contracts/Gallery.sol/Gallery.json'

export default function Owned() {

    const[nfts, setNFTs] = useState([])
    const[State, setState] = useState('not-loaded')
  
    useEffect(() => {
      loadNFTs()
    },[])
  

        async function loadNFTs() {

            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()

            const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider)
            const galleryContract = new ethers.Contract(nftgalleryaddress, Gallery.abi, signer)
        
           
            const data = await galleryContract.fetchMyTokens()
          
        
            
            const items = await Promise.all(data.map(async i => {
              const tokenUri = await nftContract.tokenURI(i.tokenId)
              const meta = await axios.get(tokenUri)
              let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
              let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
              }
              return item
            }))
            setNFTs(items)
            
            setState('loaded') 
          }
      
        
          if (State === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">You don't own any Painting.</h1>)
        
        
          return (
            <div className="flex justify-center">
              <div className="px-4" style={{ maxWidth: '1600px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                  {
                    nfts.map((nft, i) => (
                      <div key={i} className="border shadow rounded-xl overflow-hidden">
                        <img src={nft.image} />
                        <div className="p-4">
                          <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                          <div style={{ height: '70px', overflow: 'hidden' }}>
                            <p className="text-gray-400">{nft.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        
}