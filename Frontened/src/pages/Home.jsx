import React, { useState, useEffect } from 'react'
import Navbar from '../components/Home/Hero/Navbar'
import Footer from '../components/Home/Footer'
import Carosel from '../components/Home/Hero/Carosel'
import CartIcon from '../components/Home/CartIcon'
import HomeProducts from '../components/Home/HomeProducts'
import HomeCategory from '../components/Home/HomeCategory'
import JustForYou from '../components/Home/JustForYou'

// লোডিং স্পিনার এনিমেশন
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
  </div>
)

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 2 সেকেন্ড পরে লোডিং এনিমেশন বন্ধ হবে, আপনি এটি নিজের মতো করে কাস্টমাইজ করতে পারেন
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Clean up the timer
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Navbar />
      <Carosel />
      <CartIcon />
      <p className='container mx-auto font-bold text-2xl my-4 p-4'>Flash Sale</p>
      <HomeProducts />
      <p className='container mx-auto font-bold text-2xl my-4 p-4'>Categories</p>
      <HomeCategory />
      <JustForYou />
      <Footer />
    </>
  )
}

export default Home
