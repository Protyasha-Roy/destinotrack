import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { SearchOutlined } from '@ant-design/icons';

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      const userEmail = localStorage.getItem('userEmail');
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/allStudents`, {userEmail});
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleView = (record) => {
    // Navigate to the student details page
    navigate(`/studentDetails/${record._id}`);
  };

  const handleEdit = (record) => {
    // Navigate to the student profile page
    navigate(`/studentDetails/${record._id}`);
  };

  const handleDelete = async (record) => {
    try {
      const id = record._id
      // Delete the student from the database
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteStudent/${id}`);
      // Remove the deleted student from the state
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== record._id));
      message.success('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      message.error('Error deleting student. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            type="text"
            placeholder="Search Name"
            value={selectedKeys[0] || ''} 
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirm();
              }
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.fullName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Roll',
      dataIndex: 'roll',
      key: 'roll',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <input
            type="text"
            placeholder="Search Roll"
            value={selectedKeys[0] || ''}  
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                confirm();
              }
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.roll.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: 'Session Year',
      dataIndex: 'sessionYear',
      key: 'sessionYear',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Clubs',
      dataIndex: 'clubsToJoin',
      key: 'clubsToJoin',
      render: (text) => (Array.isArray(text) ? text.join(', ') : ''),// Assumes 'clubs' is an array in the student object
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleView(record)}>
            View
          </Button>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='w-full m-auto'>
      <Header />
      <Table
        dataSource={students}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default StudentsList;
