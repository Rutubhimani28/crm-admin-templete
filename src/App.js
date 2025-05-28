import React, { Suspense, useEffect } from 'react'

// ** Router Import
import Router from './router/Router'
import axiosInstance from './auth/axiosInstance'
import { Await } from 'react-router-dom'

const App = () => {
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
