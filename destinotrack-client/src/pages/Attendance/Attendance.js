import React, { useState } from 'react';
import { Input, Button, Select, Form, message } from 'antd';
import axios from 'axios';
import Header from '../../components/Header/Header';

const { TextArea } = Input;
const { Option } = Select;

const Attendance = () => {
  const [rolls, setRolls] = useState('');
  const [clubName, setClubName] = useState('');
  const [checkingMessage, setCheckingMessage] = useState('');
  const [isAttendance, setIsAttendace] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
      if(isAttendance === true) {
        handleAddToAttendance();
      } else if(isAttendance === false) {
        handleCheckRolls(values);
      }
  };

  const handleCheckRolls = async (values) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/checkAttendance`, {
        rolls: values.rolls.split(',').map((roll) => roll.trim()), // Convert rolls to an array
        clubName: values.clubName,
        userEmail
      });

      if (response.data === 'Rolls matched') {
        setCheckingMessage('Rolls matched');
      } else if (Array.isArray(response.data.mismatchedRolls)) {
        setCheckingMessage(`Mismatched rolls: ${response.data.mismatchedRolls.join(', ')}`);
      } else {
        setCheckingMessage('Error checking attendance');
      }
    } catch (error) {
      setCheckingMessage('Error checking attendance');
      console.error('Error checking attendance:', error);
    }
  }

  const handleAddToAttendance = async () => {
    try {
      setIsSubmitting(true);
      const userEmail = localStorage.getItem('userEmail');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addToAttendance`, {
        rolls: rolls.split(',').map((roll) => roll.trim()), // Convert rolls to an array
        clubName,
        userEmail
      });

      message.success(response.data.message);
    } catch (error) {
      message.error(error.response.data.error)
    } finally{
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-4 m-auto' style={{ marginTop: '50px' }}>
      <Header />
      <Form layout='vertical' onFinish={onFinish}>
        <Form.Item
          label="Enter rolls separated by commas"
          name="rolls"
          rules={[
            {
              required: true,
              message: 'Please enter rolls separated by commas',
              whitespace: true,
            },
          ]}
        >
          <TextArea
          rows={5}
            placeholder="Enter rolls separated by commas"
            onChange={(e) => setRolls(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Select club name"
          name="clubName"
          rules={[
            {
              required: true,
              message: 'Please select a club name',
            },
          ]}
        >
          <Select
            placeholder="Select club name"
            onChange={(value) => setClubName(value)}
          >
            <Option value="Science Club">Science Club</Option>
            <Option value="Programming Club">Programming Club</Option>
            <Option value="Language Club">Language Club</Option>
            <Option value="Debate Club">Debate Club</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div className='flex m-5'>
            <Button onClick={() => setIsAttendace(false)} type="primary" htmlType="submit">
              Check Attendance
            </Button>
            <Button onClick={() => setIsAttendace(true)} type="primary" disabled={isSubmitting} htmlType='submit' style={{ marginLeft: '10px' }}>
              Add to Attendance
            </Button>
          </div>
        </Form.Item>
      </Form>
      <p className='textCenter'>{checkingMessage}</p>
    </div>
  );
};

export default Attendance;
