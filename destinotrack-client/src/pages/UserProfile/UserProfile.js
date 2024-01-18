import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Spin, Row, Col, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    axios.get(`${process.env.REACT_APP_API_URL}/getUserByEmail?email=${userEmail}`).then((response) => {
      setUserData(response.data);
      setLoading(false);
    });
  }, []);

  const onFinish = (values) => {
    setIsSubmitting(true);
    axios.put(`${process.env.REACT_APP_API_URL}/updateUser`, values).then((response) => {
      message.success(response.data.message);
      setEditing(false);
      setUserData(response.data);
      setIsSubmitting(false);
    });
  };

  const deleteAccount = () => {
    const userEmail = localStorage.getItem('userEmail');
    axios.delete(`${process.env.REACT_APP_API_URL}/deleteUser?email=${userEmail}`).then((response) => {
      message.success(response.data.message);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('rememberUser');
      localStorage.removeItem('userLoggedIn');
      navigate('/');
    });
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  if (loading) {
    return (
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col>
          <Spin size="large" />
        </Col>
      </Row>
    );
  }

  return (
    <div className='w-4 m-auto' style={{ marginTop: '50px' }}>
      <Header />
      <Form
        name="userProfileForm"
        initialValues={{ username: userData.username, email: userData.email, password: userData.password }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item label="User Name" name="username">
          <Input prefix={<UserOutlined />} disabled={!editing} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input prefix={<MailOutlined />} disabled />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password prefix={<LockOutlined />} disabled={!editing} />
        </Form.Item>
        {editing ? (
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Update Profile
              </Button>
              <Button onClick={toggleEditing}>Cancel</Button>
            </Space>
          </Form.Item>
        ) : (
          <Form.Item className='flex gap-10'>
            <Button type="primary" onClick={toggleEditing} icon={<EditOutlined />}>
              Edit Profile
            </Button>
            <Button type="primary" danger className='ml-10' onClick={deleteAccount}>
              Delete Account
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default UserProfile;
