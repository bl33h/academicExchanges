import './App.scss';
import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {supabase} from './supabase/client.js';
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import NotFound from "./pages/NotFound/NotFound";
import NavBar from "./components/NavBar/NavBar";
import StudentsInExchanges from "./pages/StudentsInExchanges/Page/StudentsInExchanges";
import Students from "./pages/Students/Students/Students";
import Universities from "./pages/Universities/Universities/Universities";
import NewUniversity from "./pages/Universities/New/NewUniversity";
import Summary from "./pages/Summary/Summary";
import EditUniversity from "./pages/Universities/Edit/Edit";
import NewStudent from "./pages/Students/New/NewStudent";
import EditStudent from "./pages/Students/Edit/EditStudent";
import NewExchange from "./pages/StudentsInExchanges/New/NewExchange";
import EditExchange from "./pages/StudentsInExchanges/Edit/EditExchange";

const App = () => {
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <div className="App">
            <Router>
                {session ? (
                    <>
                        <NavBar/>
                        <Routes>
                            <Route path="/" element={<StudentsInExchanges/>}/>
                            {/*INTERCAMBIOS*/}
                            <Route path="/estudiantes-de-intercambio" element={<StudentsInExchanges/>}/>
                            <Route path="/estudiantes-de-intercambio/new" element={<NewExchange/>}/>
                            <Route path="/estudiantes-de-intercambio/edit/:id" element={<EditExchange/>}/>
                            {/*STUDENTS*/}
                            <Route path="/estudiantes" element={<Students/>}/>
                            <Route path="/estudiantes/new" element={<NewStudent/>}/>
                            <Route path="/estudiantes/edit/:id" element={<EditStudent/>}/>
                            {/*UNIVERSITIES*/}
                            <Route path="/universidades" element={<Universities/>}/>
                            <Route path={"/universidades/new"} element={<NewUniversity/>}/>
                            <Route path={"/universidades/edit/:id"} element={<EditUniversity/>}/>
                            {/*STATISTICS*/}
                            <Route path="/resumen" element={<Summary/>}/>
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </>
                ) : (
                    <Routes>
                        <Route path="/" element={<LogIn/>}/>
                        <Route path="/sign-up" element={<SignUp/>}/>
                    </Routes>
                )}
            </Router>
        </div>
    );
}

export default App;