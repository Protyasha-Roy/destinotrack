import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Collapse, message } from 'antd';
import axios from 'axios';
import Header from '../../components/Header/Header';

const { Panel } = Collapse;

const AllMails = () => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshMails = async () => {
    const userEmail = localStorage.getItem('userEmail');

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/allMails`, {
        params: { userEmail },
      });
      setMails(response.data);
    } catch (error) {
      console.error('Error fetching mails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMails = async () => {
      const userEmail = localStorage.getItem('userEmail');

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/allMails`, {
          params: { userEmail },
        });
        setMails(response.data);
      } catch (error) {
        console.error('Error fetching mails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, []);

  const handleDelete = async (record) => {

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteMail/${record._id}`);

      refreshMails();
      message.success('Mail deleted successfully!');
    } catch (error) {
      console.error('Error deleting mail:', error);
      message.error('Error deleting mail. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'From email',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'Send to',
      dataIndex: 'recipient',
      key: 'recipient',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (text) => (
        <Collapse>
        <Panel header="Expand Message" key="1" items={[{ key: '1', node: <div>{text}</div> }]}>
          {text}
        </Panel>
      </Collapse>
      ),
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
      <Table
        dataSource={mails}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AllMails;