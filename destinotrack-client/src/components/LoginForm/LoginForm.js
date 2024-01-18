import React, { useState } from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsSubmitting(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/login`, values);
      localStorage.setItem('userLoggedIn', true);
      localStorage.setItem('rememberUser', values.remember);
      localStorage.setItem('userEmail', values.email);
      setMessage('Login successful!');
      navigate('/');
    } catch (error) {
      if(error.response.data) {
        setMessage(error.response.data.error);
      }
    } finally {
      setIsSubmitting(false); 
    }
  };
  
  return (
    <>
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      {
        !isRegistered && <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      }
      <Form.Item
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form.Item>

      <p style={{color: 'red', textAlign: 'center'}}>{message}</p>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" disabled={isSubmitting}>
          {isRegistered ? 'Log in' : 'Sign up'}
        </Button>
        Or <span className='blue-text' onClick={() => setIsRegistered(!isRegistered)}>{isRegistered ? 'register now' : 'login here'}</span>
      </Form.Item>
    </Form> 
    </>
  );
};
export default LoginForm;