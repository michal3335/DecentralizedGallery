import {ethers} from 'ethers'
import { useEffect, useState } from 'react'
import {create as ipfsHttpClient} from 'ipfs-http-client'
import Web3Modal from 'web3modal'

import { nftgalleryaddress, nftaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Gallery from '../artifacts/contracts/Gallery.sol/Gallery.json'

import { useRouter } from 'next/dist/client/router'

const ipfs = ipfsHttpClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

export default function MintItem(){
  
    const [fileUrl, setUrl] = useState(null)
    const [formInput, setForm] = useState({price: '', name: '', description: ''})
    const router = useRouter()

    async function onChange(event){
        const file = event.target.files[0]
        try{
        const uploaded = await ipfs.add(
            file, {
                progress: (progress) => console.log(`Data loaded: ${progress}`)
            }
        )
        const url = `https://ipfs.io/ipfs/${uploaded.path}`
        setUrl(url)
        }catch(e){
            console.log('Error, file cannot be uploaded: ',e)
        }
    } 

    async function addPainting(){
        const{name, description, price} = formInput
        if(!name || !price || !fileUrl) return console.log("Empty value")
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try{
            const uploaded = await ipfs.add(data)
            const url = `https://ipfs.io/ipfs/${uploaded.path}`
            createSale(url)

        }catch(e){
            console.log('error', e)
        }
    }

    async function createSale(url){


            const web = new Web3Modal()
            const connection = await web.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
   
            
            let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
            let transaction = await contract.mintToken(url)
            let tx = await transaction.wait()
            let event = tx.events[0]
            console.log(event)
            let value = event.args[2]
            let tokenId = value.toNumber()
            const price = ethers.utils.parseUnits(formInput.price, 'ether')

            contract = new ethers.Contract(nftgalleryaddress, Gallery.abi, signer)
            let listingPrice = await contract.getListingPrice()
            listingPrice = listingPrice.toString()

            try{

            transaction = await contract.newGalleryItem(nftaddress, tokenId, price, {value: listingPrice})
            await transaction.wait()
            router.push('./')

            }catch(e){
              console.log(e)
            }

    }
    return(
        <div className='flex justify-center'>
            <div className="w-1/4 flex flex-col pb-12">
        <input 
          placeholder="Painting name"
          className="mt-6 border rounded p-3"
          onChange={i => setForm({ ...formInput, name: i.target.value })}
        />
        <textarea
          placeholder="Painting Description"
          className="mt-3 border rounded p-3"
          onChange={i => setForm({ ...formInput, description: i.target.value })}
        />
        <input
          placeholder="Price of the Painting"
          className="mt-3 border rounded p-3"
          onChange={i => setForm({ ...formInput, price: i.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={addPainting} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Mint Painting
        </button>
      </div>

        </div>
    )
}