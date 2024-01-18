import React from 'react';
import './DefaultHome.css';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';

const DefaultHome = () => {
    const navigate = useNavigate();

    return(
        <section>
            <h2 className='headingText'><span className='appName'>UniTrack</span> - Student Management System</h2>
            <div className='container'>
                <div className='centeredDiv'>
                    <h3>#Things you can do in <span className='appName'>UniTrack</span></h3>
                    <ul>
                        <li>Add student data.</li>
                        <li>Manage student data.</li>
                        <li>Take Attendance.</li>
                        <li>Send emails to multiple email addresses at once</li>
                    </ul>
                </div>
                <div className='container'>
                    <p className='blueText'>Login or Register to start managing!</p>
                    <Button onClick={() => navigate('/login')}>Go To Login Page</Button>
                </div>
            </div>
            <Footer />
        </section>
    )
}

export default DefaultHome;
