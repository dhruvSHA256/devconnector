import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
            console.log("success");
            // const newUser = { name, email, password };
            // try {
            //     const res = await axios.post("/api/users", newUser);
            //     console.log(res.data);
            // } catch (err) {
            //     console.error(err);
            // }
            // register({ name, email, password });
    }
    return (
        <Fragment>
            <section className='container'>
            <h1 className="large text-primary">Sign in</h1>
            <p className="lead">
                <i className="fas fa-user"></i> Signin to your account
            </p>
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Register"
                />
            </form>
            <p className="my-1">
                 New to devconnector ? <Link to="/register">Register</Link>
            </p>
            </section>
        </Fragment>
    );
};

export default Login;
