import './App.scss';
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import NotFound from "./pages/NotFound/NotFound";
import Exchanges from "./pages/Exchanges/Exchanges";
import NewExchange from "./pages/Exchanges/NewExchange";
import EditExchange from "./pages/Exchanges/EditExchange";


const App = () => {
    return (
        <div className="App">
            <Router>
                <>
                    {/*<NavBar/>*/}
                    <Routes>
                        <Route path="/" element={<Exchanges/>}/>
                        {/*INTERCAMBIOS*/}
                        <Route path="/exchanges" element={<Exchanges/>}/>
                        <Route path="/exchange/new" element={<NewExchange/>}/>
                        <Route path="/exchange/edit/:id" element={<EditExchange/>}/>
                        {/*/!*STUDENTS*!/*/}
                        {/*<Route path="/students" element={<Students/>}/>*/}
                        {/*<Route path="/students/new" element={<NewStudent/>}/>*/}
                        {/*<Route path="/students/edit/:id" element={<EditStudent/>}/>*/}
                        {/*/!*UNIVERSITIES*!/*/}
                        {/*<Route path="/universities" element={<Universities/>}/>*/}
                        {/*<Route path={"/universities/new"} element={<NewUniversity/>}/>*/}
                        {/*<Route path={"/universities/edit/:id"} element={<EditUniversity/>}/>*/}
                        {/*/!*STATISTICS*!/*/}
                        {/*<Route path="/summary" element={<Summary/>}/>*/}
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </>
            </Router>
        </div>
    );
}

export default App;