import './App.css';
import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import AddEducation from './components/profile-form/AddEducation';
import AddExperience from './components/profile-form/AddExperience';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Navbar from './components/layout/Navbar';
import NotFound from './components/layout/NotFound';
import Post from './components/post/Post';
import Posts from './components/posts/Posts';
import PrivateRoute from './components/routing/PrivateRoute';
import Profile from './components/profile/Profile';
import ProfileForm from './components/profile-form/ProfileForm';
import Profiles from './components/profiles/Profiles';
import Register from './components/auth/Register';

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
                        <Route
                            path="posts"
                            element={<PrivateRoute component={Posts} />}
                        />
                        <Route
                            path="posts/:id"
                            element={<PrivateRoute component={Post} />}
                        />
                        <Route path="/*" element={<NotFound />} />
                    </Routes>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
