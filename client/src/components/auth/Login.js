import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios'; Since we are going to use redux, we will not use axios.

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = event => setFormData({ ...formData, [event.target.name]: event.target.value });
  const onSubmit = async event => {
    event.preventDefault();

    console.log(`SUCCESS!`);
    // We are going to use redux for actions. Thats why we will not use above code to make requests.

    // const User = {
    //   email,
    //   password,
    // };
    // try {
    //   const config = {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   };
    //   const body = JSON.stringify(newUser);
    //   const res = await axios.post('/api/users', body, config);
    //   console.log(res.data);
    // } catch (err) {
    //   console.error(err.response.data);
    // }
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Sign Into Your Account
      </p>
      <form className='form' onSubmit={event => onSubmit(event)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={event => onChange(event)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={event => onChange(event)}
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Login' />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
