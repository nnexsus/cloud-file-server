import { createContext, useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";


import File from "./components/file";
import Header from "./components/header";
import Signin from "./components/signin";
import Signup from "./components/signup";
import Signout from './components/signout';
import Home from './components/home';

import { Global } from './globalStyles';
import Account from './components/account';
import Forgot from "./components/forgot";
import Reset from './components/reset';
import SingleFile from "./components/singlefile";
import Verify from './components/verify';
import About from "./components/about";
import Footer from "./components/footer";
import Tos from "./components/tos";
import Discord from "./components/discord";

export const Context = createContext();

function App() {

  const [state, setState] = useState(undefined);

  return (
    <>
      <Global/>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/augmented-ui@2/augmented-ui.min.css"></link>
        <Context.Provider value={[state, setState]}>
          <Router>
            <div className="App">
              <Header></Header>
                  <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/files" element={<File/>}/>
                    <Route path="/file/:id" element={<SingleFile/>}/>
                    <Route path="/signin" element={<Signin/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/signout" element={<Signout/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/forgot" element={<Forgot/>}/>
                    <Route path="/reset/:id" element={<Reset/>}/>
                    <Route path="/verify/:id" element={<Verify/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/tos" element={<Tos/>}/>
                    <Route path="/discord" element={<Discord/>}/>
                  </Routes>
              <Footer></Footer>
            </div>
          </Router>
        </Context.Provider>
    </>
  );
}

export default App;
