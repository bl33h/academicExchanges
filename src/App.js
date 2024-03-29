import './App.scss';
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import NotFound from "./pages/NotFound/NotFound";
import Statistics from "./pages/Statistics/Statistics";
import Exchanges from "./pages/Exchanges/Exchanges";
import ExchangeDetails from "./pages/Exchanges/ExchangeDetails";
import NewExchange from "./pages/Exchanges/NewExchange";
import EditExchange from "./pages/Exchanges/EditExchange";
import Students from "./pages/Students/Students";
import NewStudent from "./pages/Students/NewStudent";
import EditStudent from "./pages/Students/EditStudent";
import Universities from "./pages/Univerisites/Universities";
import NewUniversity from "./pages/Univerisites/NewUniversity";
import EditUniversity from "./pages/Univerisites/EditUniversity";

import NavBar from "./components/NavBars/NavBar";


const App = () => {
    return (
        <div className="App">
            <Router>
                <>
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<Exchanges/>}/>
                        {/*INTERCAMBIOS*/}
                        <Route path="/exchanges" element={<Exchanges/>}/>
                        <Route path="/exchanges/new" element={<NewExchange/>}/>
                        <Route path="/exchanges/edit/:id" element={<EditExchange/>}/>
                        <Route path="/exchanges/details/:id" element={<ExchangeDetails/>}/>
                        {/*STUDENTS*/}
                        <Route path="/students" element={<Students/>}/>
                        <Route path="/students/new" element={<NewStudent/>}/>
                        <Route path="/students/edit/:id" element={<EditStudent/>}/>
                        {/*UNIVERSITIES*/}
                        <Route path="/universities" element={<Universities/>}/>
                        <Route path={"/universities/new"} element={<NewUniversity/>}/>
                        <Route path={"/universities/edit/:id"} element={<EditUniversity/>}/>
                        {/*/!*STATISTICS*!/*/}
                        <Route path="/statistics" element={<Statistics/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </>
            </Router>
        </div>
    );
}

export default App;