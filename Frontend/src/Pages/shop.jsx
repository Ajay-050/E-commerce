import React from 'react'
import Hero from '../components/Hero/Hero.jsx'
import Popular from '../components/Popular/Popular.jsx'
import Offer from '../components/Offer/Offer.jsx'
import NewCollections from '../components/NewCollections/NewCollections.jsx'
import NewsLetter from '../components/NewsLetter/NewsLetter.jsx'

const Shop = () => {
  return (
    <div>
      <Hero/>
      <Popular/>
      <Offer/>
      <NewCollections/>
      <NewsLetter/>
    </div> 
  )
}

export default Shop