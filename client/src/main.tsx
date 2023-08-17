import React from 'react'
import ReactDOM from 'react-dom/client'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import App from './App.tsx'
import './index.css'

const theme = extendTheme({
    colors: {
        brand: {
            'primary': "#1A73E8",
            'white': "#fff",
            'black': 'rgba(0,0,0,1)',
            'gray':  'rgba(52, 64, 84, 1)'
        },
    },
})
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
  </React.StrictMode>,
)
