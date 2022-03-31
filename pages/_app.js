import '../styles/globals.css'
import Link from 'next/link'
import './app.css'
import React, { Component } from "react";

function DecentralizedGallery({Component, page}){
  return(

  <div>
    <nav className='border-b p-6' style={{backgroundColor: '#3D00D0'}}>
      <p className='text-xl font-bold text-white ' style={{textAlign: 'center'}}>Decentralized Gallery</p>
      <div className='flex mt-4 justify-center'>
        <Link href='/'>
          <a className='mr-4 font-bold' style={{color: '#63D33F'}}>
            For sale
          </a>
        </Link>
        <Link href='/gallery'>
          <a className='mr-6 text-white'>
            Gallery
          </a>
        </Link>
        <Link href='/mint'>
          <a className='mr-6 text-white'>
            Mint
          </a>
        </Link>
        <Link href='/owned-nft'>
          <a className='mr-6 text-white'>
            My Paintings
          </a>
        </Link>
      </div>
    </nav>
    <Component {...page} />
  </div>
  )
}

export default DecentralizedGallery;