import './App.css';
import { Fragment } from 'react';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Router>
            < Fragment >
                <Navbar />
                <section>
                    <Routes>
                        <Route exact path="/" element={<Landing />} />
                        <Route path="/" element={<Landing />} />
                        <Route path="register" element={<Register />} />
                        <Route path="login" element={<Login />} />
                    </Routes>
                </section>
            </Fragment >
        </Router>
    );
}

export default App;
