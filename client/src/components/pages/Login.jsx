import React from 'react'
import { assets } from '../../assets/assets'
import Signup from './Signup'
// import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='min-h-screen flex felx-col md:flex-row'>
        {/*background image */}
        {/* <img src={assets.bgImage}alt='' className='absolute top-0 left-0 -z-1 w-full h-full object-cover'/> */}


      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        {/* <SignIn/> */}
        <Signup/>

      </div>
    </div>
  )
}

export default Login
