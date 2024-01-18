import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message, DatePicker } from 'antd';
import axios from 'axios';
import Header from '../../components/Header/Header';

const AttendanceList = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredDate, setFilteredDate] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      const userEmail = localStorage.getItem('userEmail');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/allAttendance`, {
          params: { userEmail },
        });
        setAttendanceList(response.data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const handleDelete = async (record) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteAttendance/${record._id}`);
      setAttendanceList((prevAttendance) => prevAttendance.filter((att) => att._id !== record._id));
      message.success('Attendance record deleted successfully!');
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      message.error('Error deleting attendance record. Please try again.');
    }
  };

  const handleDateChange = (date, dateString) => {
    // Handle date change and perform filtering
    setFilteredDate(dateString);
  };

  const filteredAttendance = attendanceList.filter((attendance) => {
    // Perform filtering based on the selected date
    return !filteredDate || attendance.date === filteredDate;
  });

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Present Rolls',
      dataIndex: 'presentRolls',
      key: 'presentRolls',
      render: (text) => text.join(', '),
    },
    {
      title: 'Absent Rolls',
      dataIndex: 'absentRolls',
      key: 'absentRolls',
      render: (text) => text.join(', '),
    },
    {
      title: 'Club',
      dataIndex: 'clubName',
      key: 'clubName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <DatePicker onChange={handleDateChange} />
      <Table
        dataSource={filteredAttendance}
        columns={columns}
        loading={loading}
        rowKey="_id" // Use a unique identifier for each row, assuming "_id" is the unique identifier
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AttendanceList;
