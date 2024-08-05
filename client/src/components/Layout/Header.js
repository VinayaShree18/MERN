import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { message, Dropdown, Menu, Avatar } from 'antd';
import { UserOutlined, UploadOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import AddPersonalDetails from './AddPersonalDetails';
import './Header.css';

const Header = () => {
  const [loginUser, setLoginUser] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setLoginUser(user);
      setProfilePicture(user.profilePicture);
      fetchUserDetails(user._id); 
    }
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/userdetails/${userId}`);
      if (response.data.success) {
        const userDetails = response.data.userDetails;
        setLoginUser(userDetails);
        setProfilePicture(userDetails.profilePicture);
        localStorage.setItem('user', JSON.stringify(userDetails));
      } else {
        message.error('Failed to fetch user details');
      }
    } catch (error) {
      message.error('Failed to fetch user details');
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('user');
    message.success('Logout Successfully');
    navigate('/login');
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicture(e.target.result);
      const user = JSON.parse(localStorage.getItem('user'));
      user.profilePicture = e.target.result;
      localStorage.setItem('user', JSON.stringify(user));
      setLoginUser(user);
    };
    reader.readAsDataURL(file);
  };

  const menu = (
    <Menu>
      <Menu.Item key="upload">
        <label htmlFor="uploadInput" style={{ cursor: 'pointer' }}>
          <UploadOutlined />
          Upload Profile Picture
        </label>
        <input
          type="file"
          id="uploadInput"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </Menu.Item>
      <Menu.Item key="personalDetails" onClick={() => setIsModalVisible(true)}>
        <EditOutlined />
        {loginUser?.profession || loginUser?.phone || loginUser?.address ? 'Update Profile' : 'Add Personal Details'}
      </Menu.Item>
      <Menu.Item key="logout" onClick={logoutHandler}>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  const updateUser = (user) => {
    setLoginUser(user);
    setProfilePicture(user.profilePicture);
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <div className='headers'>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link className="navbar-brand" to="/">Expense Management</Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Dropdown overlay={menu} trigger={['click']}>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <Avatar
                      src={profilePicture}
                      icon={!profilePicture && <UserOutlined />}
                      size="large"
                      style={{ backgroundColor: '#87d068' }}
                    />
                  </a>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <AddPersonalDetails
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        user={loginUser}
        updateUser={updateUser}
      />
    </div>
  );
};

export default Header;
