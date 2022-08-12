import './App.css';
import { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Alert from './components/layout/Alert';

//redux
import { Provider } from 'react-redux';
import store from './store';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Alert />
                    <Routes>
                        <Route exact path="/" element={<Landing />} />
                        <Route path="/" element={<Landing />} />
                        <Route path="register" element={<Register />} />
                        <Route path="login" element={<Login />} />
                    </Routes>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
