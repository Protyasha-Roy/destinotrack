import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Checkbox, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values) => {
    const userEmail = localStorage.getItem('userEmail');
    const dataToSubmit = {...values, userEmail: userEmail};
    try {
      setIsSubmitting(true)
      // Make an Axios POST request to submit the form data
      await axios.post(`${process.env.REACT_APP_API_URL}/submitForm`, dataToSubmit);

      // Clear form fields after successful submission
      form.resetFields();

      // Show success message
      message.success('Form submitted successfully!');
    } catch (error) {
      if(error.response) {
        message.error(error.response.data.error);
      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <Form
      form={form}
      name="addStudentForm"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{
        minWidth: 300,
        maxWidth: 500,
        margin: '50px auto'
      }}
      autoComplete='off'
    >
      {/* Personal Details */}
      <h2 className='blueText textCenter'>Personal Details</h2>
      <Form.Item
        label="Full Name"
        name="fullName"
        rules={[{ required: true, message: 'Please enter full name' }]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>

      <Form.Item
        label="Father's Name"
        name="fatherName"
        rules={[{ required: true, message: 'Please enter father\'s name' }]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>

      <Form.Item
        label="Mother's Name"
        name="motherName"
        rules={[{ required: true, message: 'Please enter mother\'s name' }]}
      >
        <Input prefix={<UserOutlined />} />
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        name="dob"
        rules={[{ required: true, message: 'Please select date of birth' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Current Address"
        name="currentAddress"
        rules={[{ required: true, message: 'Please enter current address' }]}
      >
        <Input prefix={<EnvironmentOutlined />} />
      </Form.Item>

      <Form.Item
        label="Permanent Address"
        name="permanentAddress"
        rules={[{ required: true, message: 'Please enter permanent address' }]}
      >
        <Input prefix={<EnvironmentOutlined />} />
      </Form.Item>

      <Form.Item
        label="Blood Group"
        name="bloodGroup"
      >
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
      </Form.Item>

      <Form.Item
        label="Gender"
        name="gender"
        rules={[{ required: true, message: 'Please select gender' }]}
      >
        <Select>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Religion"
        name="religion"
        rules={[{ required: true, message: 'Please select religion' }]}
      >
        <Select>
          <Option value="Islam">Islam</Option>
          <Option value="Hinduism">Hinduism</Option>
          <Option value="Buddhism">Buddhism</Option>
          <Option value="Christianity">Christianity</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      {/* Contact Details */}
      <h2 className='blueText textCenter'>Contact Details</h2>
      <Form.Item
        label="Email"
        name="email"
      >
        <Input prefix={<MailOutlined />} />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phoneNumber"
        rules={[{ required: true, message: 'Please enter phone number' }]}
      >
        <Input prefix={<PhoneOutlined />} />
      </Form.Item>

      <Form.Item
        label="Facebook Account Link"
        name="facebookLink"
      >
        <Input />
      </Form.Item>

      {/* Academic Details */}
      <h2 className='blueText textCenter'>Academic Details</h2>
      <Form.Item
        label="Session Year"
        name="sessionYear"
        rules={[{ required: true, message: 'Please enter session year' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Group"
        name="group"
        rules={[{ required: true, message: 'Please select group' }]}
      >
        <Select>
          <Option value="science">Science</Option>
          <Option value="commerce">Commerce</Option>
          <Option value="arts">Arts</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>


      <Form.Item
        label="Roll"
        name="roll"
        rules={[{ required: true, message: 'Please enter roll' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Clubs to Join"
        name="clubsToJoin"
      >
        <Checkbox.Group>
          <Checkbox value="Science Club">Science Club</Checkbox>
          <Checkbox value="Programming Club">Programming Club</Checkbox>
          <Checkbox value="Debate Club">Debate Club</Checkbox>
          <Checkbox value="Language Club">Language Club</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      {/* Submit Button */}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
