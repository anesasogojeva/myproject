import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Products from './pages/User/Products';



const theme = createTheme({
  palette: {
    background: {
      default: '#ffff',
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/Products" element={<Products />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;