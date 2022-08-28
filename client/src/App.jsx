import './App.css';
import { Fragment, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile-form/ProfileForm';
import AddEducation from './components/profile-form/AddEducation';
import AddExperience from './components/profile-form/AddExperience';
import Profile from './components/profile/Profile';
import Profiles from "./components/profiles/Profiles";
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import PrivateRoute from './components/routing/PrivateRoute';

//redux
import { Provider } from 'react-redux';
import store from './store';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

function App() {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Alert />
                    <Routes>
                        <Route exact path="/" element={<Landing />} />
                        <Route path="/" element={<Landing />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/profiles" element={<Profiles />} />
                        <Route path="profile/:id" element={<Profile />} />
                        <Route
                            path="dashboard"
                            element={<PrivateRoute component={Dashboard} />}
                        />
                        <Route
                            path="create-profile"
                            element={<PrivateRoute component={ProfileForm} />}
                        />
                        <Route
                            path="edit-profile"
                            element={<PrivateRoute component={ProfileForm} />}
                        />
                        <Route
                            path="add-experience"
                            element={<PrivateRoute component={AddExperience} />}
                        />
                        <Route
                            path="add-education"
                            element={<PrivateRoute component={AddEducation} />}
                        />
                    </Routes>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
