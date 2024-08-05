import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Spinner from "../components/Spinner";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const submitHandler = async (values) => {
    try {
      await axios.post('/users/register', values);
      message.success('Registration Successfull');
      setLoading(false);
      navigate('/login');
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
        <div className="register-form-container">
          <Form layout="vertical" onFinish={submitHandler}>
            <h1>Register Form</h1>

            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
              <Input type="email" />
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
              <Input type="password" />
            </Form.Item>

            <Form.Item>
              <div className='d-flex '>
                <Button className="register-button" type="primary" htmlType="submit">Register</Button>

              </div>
              <p>Already Registered?<Link to="/Login " className='loginlink'>Click Here to login</Link></p>
            </Form.Item>

          </Form>
        </div>
      </div>
    </>
  );

};

export default Register;
