import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
   UserOutlined
  } from '@ant-design/icons';
import axios from 'axios';
import Footer from '../Footer/Footer';

export default function HomeDash() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Fetch user data when the component mounts
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/getUserByEmail?email=${userEmail}`)
        .then((response) => {
                setUser(response.data);
                setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        });
    }
  }, []);

    const handleLogOut = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('rememberUser');
        navigate('/home');
    }

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
    <section>
        <h2 className='headingText'><span className='appName'>UniTrack</span> - Student Management System</h2>
        <div className='container'>
                <div className='container pointer'>
                    <div onClick={() => navigate(`/userProfile`)} className='border p-5 m-5 container'>
                        <UserOutlined />
                        <p>{user !== null && user.username}</p>
                    </div>
                    <Button className='w-full' onClick={handleLogOut}>Log Out</Button>
                </div>
                <div className='flex gap-10'>
                    <div className='container p-10 justify-between gap-10'>
                        <h3 className='textCenter'>Actions List</h3>
                        <Button className='w-full' onClick={() => navigate('/addStudent')}>Add new student</Button>
                        <Button className='w-full' onClick={() => navigate('/attendance')}>Take Attendance</Button>
                        <Button className='w-full' onClick={() => navigate('/sendMails')}>Send Multiple Mail</Button>
                    </div>
                    <div className='container p-10 justify-between gap-10'>
                        <h3 className='textCenter'>Saved Data</h3>
                        <Button className='w-full' onClick={() => navigate('/studentsList')}>Students List</Button>
                        <Button className='w-full' onClick={() => navigate('/attendanceList')}>Attendance List</Button>
                        <Button className='w-full' onClick={() => navigate('/allMails')}>Sent Mails</Button>
                    </div>
                </div>
            </div>
            <Footer/>
    </section>
  )
}
