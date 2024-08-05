import React, { useState, useEffect } from 'react'
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from "../components/Spinner";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/users/login', values);
      setLoading(false);
      message.success('Login Successfull');
      localStorage.setItem('user', JSON.stringify({ ...data.user, password: '' }));

      navigate('/');
    } catch (error) {
      setLoading(false);
      message.error('Something went wrong');
    }

  };
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="register-page">
        {loading && <Spinner />}

        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Login Form</h1>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
            <Input type="email" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
            <Input type="password" />
          </Form.Item>

          <Form.Item>
            <div className='d-flex justify-content-between'>
              <Button type="primary" htmlType="submit" className='loginbutton'>Login</Button>&nbsp;&nbsp;&nbsp;
              <p>Not a User?<Link to="/register" className='registerlink'>&nbsp;Register here</Link></p>
            </div>
          </Form.Item>

        </Form>
      </div>
    </>
  );
};
export default Login;