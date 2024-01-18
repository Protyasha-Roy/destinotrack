import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Checkbox, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import Header from '../../components/Header/Header';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const StudentDetails = () => {
  const [form] = Form.useForm();
  const [studentData, setStudentData] = useState({});
  const [editing, setEditing] = useState(false);
  const { studentId } = useParams();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/getStudentById?id=${studentId}`)
      .then((response) => {
          setStudentData(response.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching student details:', error);
      });
  }, []);

  const onFinish = async (values) => {
    // Update student data with the new values
    const updatedStudentData = { ...studentData, ...values };
    
    try {
      // Make an Axios PUT request to update the student data
      await axios.put(`${process.env.REACT_APP_API_URL}/updateStudent?id=${studentData._id}`, updatedStudentData);

      // Clear form fields after successful update
      form.resetFields();

      // Show success message
      message.success('Student details updated successfully!');
      setEditing(false);
      setStudentData(updatedStudentData);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      fullName: studentData.fullName || '',
      fatherName: studentData.fatherName || '',
      motherName: studentData.motherName || '',
      dob: formatDate(studentData.dob) || null,
      currentAddress: studentData.currentAddress || '',
      permanentAddress: studentData.permanentAddress || '',
      bloodGroup: studentData.bloodGroup || '',
      gender: studentData.gender || '',
      religion: studentData.religion || '',
      email: studentData.email || '',
      phoneNumber: studentData.phoneNumber || '',
      facebookLink: studentData.facebookLink || '',
      sessionYear: studentData.sessionYear || '',
      roll: studentData.roll || '',
      clubsToJoin: studentData.clubsToJoin || [],
    });
  }, [studentData, form]);

  const formatDate = (date) => {
    if (date) {
      let wholeDate = date.split('T');
        return wholeDate[0];
    }
  }
  
  const toggleEditing = () => {
    setEditing(!editing);
  };

  return (
    <div className='w-4 m-auto' style={{ marginTop: '50px' }}>
    <Header />
    <Form
    form={form}
    name="studentDetailsForm"
    onFinish={onFinish}
    >
        <Form.Item label="Full Name" name="fullName">
            {editing ? (
            <Input prefix={<UserOutlined />} />
            ) : (
            <span>{studentData.fullName}</span>
            )}
      </Form.Item>

      <Form.Item label="Father's Name" name="fatherName">
        {editing ? (
          <Input prefix={<UserOutlined />} />
        ) : (
          <span>{studentData.fatherName}</span>
        )}
      </Form.Item>

      <Form.Item label="Mother's Name" name="motherName">
        {editing ? (
          <Input prefix={<UserOutlined />} />
        ) : (
          <span>{studentData.motherName}</span>
        )}
      </Form.Item>

      <Form.Item label="Date of Birth" name="dob">
        {editing ? (
          <Input style={{ width: '100%' }} />
        ) : (
          <span>{formatDate(studentData.dob)}</span>
        )}
      </Form.Item>

      <Form.Item label="Current Address" name="currentAddress">
        {editing ? (
          <Input prefix={<EnvironmentOutlined />} />
        ) : (
          <span>{studentData.currentAddress}</span>
        )}
      </Form.Item>

      <Form.Item label="Permanent Address" name="permanentAddress">
        {editing ? (
          <Input prefix={<EnvironmentOutlined />}/>
        ) : (
          <span>{studentData.permanentAddress}</span>
        )}
      </Form.Item>

      <Form.Item label="Blood Group" name="bloodGroup">
        {editing ? (
          <Select>
          <Option value="A+">A+</Option>
          <Option value="A-">A-</Option>
          <Option value="B+">B+</Option>
          <Option value="B-">B-</Option>
          <Option value="AB+">AB+</Option>
          <Option value="AB-">AB-</Option>
          <Option value="O+">O+</Option>
          <Option value="O-">O-</Option>
        </Select>
        ) : (
          <span>{studentData.bloodGroup}</span>
        )}
      </Form.Item>

      <Form.Item label="Gender" name="gender">
        {editing ? (
          <Select>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        ) : (
          <span>{studentData.gender}</span>
        )}
      </Form.Item>

      <Form.Item label="Religion" name="religion">
        {editing ? (
         <Select>
         <Option value="Islam">Islam</Option>
         <Option value="Hinduism">Hinduism</Option>
         <Option value="Buddhism">Buddhism</Option>
         <Option value="Christian">Christian</Option>
         <Option value="other">Other</Option>
       </Select>
        ) : (
          <span>{studentData.religion}</span>
        )}
      </Form.Item>

      <Form.Item label="Email" name="email">
        {editing ? (
          <Input prefix={<MailOutlined />} />
        ) : (
          <span>{studentData.email}</span>
        )}
      </Form.Item>

      <Form.Item label="Phone Number" name="phoneNumber">
        {editing ? (
          <Input prefix={<PhoneOutlined />} />
        ) : (
          <span>{studentData.phoneNumber}</span>
        )}
      </Form.Item>

      <Form.Item label="Facebook Account Link" name="facebookLink">
        {editing ? (
          <Input />
        ) : (
          <span>{studentData.facebookLink}</span>
        )}
      </Form.Item>

      <Form.Item label="Session Year" name="sessionYear">
        {editing ? (
          <Input />
        ) : (
          <span>{studentData.sessionYear}</span>
        )}
      </Form.Item>

      <Form.Item label="Group" name="group">
        {editing ? (
         <Select>
            <Option value="science">Science</Option>
            <Option value="commerce">Commerce</Option>
            <Option value="arts">Arts</Option>
            <Option value="other">Other</Option>
       </Select>
        ) : (
          <span>{studentData.group}</span>
        )}
      </Form.Item>

      <Form.Item label="Roll" name="roll">
        {editing ? (
          <Input />
        ) : (
          <span>{studentData.roll}</span>
        )}
      </Form.Item>

      <Form.Item label="Clubs" name="clubsToJoin">
        {editing ? (
         <Checkbox.Group>
            <Checkbox value="Science Club">Science Club</Checkbox>
            <Checkbox value="Programming Club">Programming Club</Checkbox>
            <Checkbox value="Debate Club">Debate Club</Checkbox>
            <Checkbox value="Language Club">Language Club</Checkbox>
       </Checkbox.Group>
        ) : (
          <span>{studentData.clubsToJoin ? studentData.clubsToJoin.join(', ') : 'No clubs selected'}</span>
        )}
      </Form.Item>

      <div className='flex gap-10'>
        {editing && (
            <Form.Item>
            <Button type="primary" htmlType="submit">
                Update Details
            </Button>
            </Form.Item>
        )}
        <Form.Item>
            <Button type="primary" onClick={toggleEditing} icon={<EditOutlined />}>
            {editing ? 'Cancel' : 'Edit Details'}
            </Button>
        </Form.Item>
      </div>
           

        </Form>
  </div>
  );
};

export default StudentDetails;