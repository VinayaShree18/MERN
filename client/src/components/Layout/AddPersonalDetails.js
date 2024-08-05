import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const AddPersonalDetails = ({ visible, onClose, user, updateUser }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(user);
  }, [user, form]);

  const handleFinish = async (values) => {
    const updatedUser = { ...user, ...values };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/userdetails/saveUserDetails', {
        id: user._id,
        user: updatedUser,
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updateUser(updatedUser);
        message.success('Profile updated successfully');
        onClose();
      } else {
        message.error('Failed to update profile');
      }
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  return (
    <Modal
      title="Add/Update Personal Details"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="profession"
          label="Profession"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="Age"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPersonalDetails;
