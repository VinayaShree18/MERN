import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Table, Modal, Form, Input, Select, message, DatePicker, Button } from 'antd';
import Layout from '../components/Layout/Layout';
import Spinner from '../components/Spinner';
import moment from 'moment';
import Analytics from '../components/Analytics';

const { RangePicker } = DatePicker;

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allTransaction, setAllTransaction] = useState([]);
    const [frequency, setFrequency] = useState('7'); // Default frequency
    const [selectedDate, setSelectedDate] = useState([moment().startOf('day'), moment().endOf('day')]); // Default date range
    const [type, setType] = useState('all');
    const [viewData, setViewData] = useState('table');
    const [editable, setEditable] = useState(null)
    const getAllTransactions = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            setLoading(true);
            const res = await axios.post("/transactions/get-transaction", {
                userid: user._id,
                frequency: frequency,
                selectedDate: [selectedDate[0].toDate(), selectedDate[1].toDate()],
                type,
            });
            setLoading(false);
            setAllTransaction(res.data);
            console.log(res.data);
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error("Fetch Issue with Transaction");
        }
    };

    useEffect(() => {
        getAllTransactions();
    }, [frequency, selectedDate, type]);

    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            setLoading(true);
            if (editable) {
                await axios.post("/transactions/edit-transaction", {
                    payload: {
                        ...values,
                        userId: user._id,
                    },
                    transactionId: editable._id
                });
                setLoading(false);
                message.success("Transaction Updated Successfully");
            } else {
                await axios.post("/transactions/add-transaction", {
                    ...values,
                    userid: user._id,
                });
                setLoading(false);
                message.success("Transaction Added Successfully")
            }
            setShowModal(false);
            setEditable(null);
            getAllTransactions(); // Refresh the transactions after adding a new one
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error("Failed to add transaction");
        }
    };
    const handleDelete = async (record) => {
        try {
            setLoading(true)
            await axios.post("/transactions/delete-transaction", { transactionId: record._id })
            setLoading(false)
            message.success("Deleted successfully")
        } catch (error) {
            setLoading(false)
            console.log(error)
            message.error("Unable to delete");
        }
    }
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount'
        },
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Category',
            dataIndex: 'category'
        },
        {
            title: 'Reference',
            dataIndex: 'reference'
        },
        {
            title: 'Description',
            dataIndex: 'description'
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <EditOutlined onClick={() => {
                        setEditable(record)
                        setShowModal(true)
                    }} />
                    <DeleteOutlined className='mx-2' onClick={() => { handleDelete(record) }} />
                </div>
            )
        },
    ];

    return (
        <Layout >
            {loading && <Spinner />}
            <div className='filters'>
                <div className='contentop'>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">Last 1 Week</Select.Option>
                        <Select.Option value="30">Last 1 Month</Select.Option>
                        <Select.Option value="365">Last 1 year</Select.Option>
                        <Select.Option value="custom">Custom</Select.Option>
                    </Select>
                    {frequency === 'custom' && (
                        <RangePicker
                            value={selectedDate}
                            onChange={(dates) => setSelectedDate(dates)}
                            style={{ marginLeft: 10 }}
                        />
                    )}
                </div>

                <div className='contentop'>
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value="all">All</Select.Option>
                        <Select.Option value="income">Income</Select.Option>
                        <Select.Option value="expense">Expense</Select.Option>
                    </Select>
                </div>

                <div className='swicth-icons'>
                    <UnorderedListOutlined className={`mx-2 ${viewData === 'table' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('table')} />
                    <AreaChartOutlined className={`mx-2 ${viewData === 'analytics' ? 'active-icon' : 'inactive-icon'}`} onClick={() => setViewData('analytics')} />
                </div>

                <Button
                    onClick={() => setShowModal(true)}
                    style={{ marginLeft: 10, backgroundColor: ' rgb(248, 179, 110)', borderColor: 'blue', color: 'black' }}
                    className='addbutton'
                >
                    Add New Transaction
                </Button>
            </div>


            <div className='content'>
                {viewData === 'table' ?
                    <Table columns={columns} dataSource={allTransaction} />
                    : <Analytics allTransaction={allTransaction} />}
            </div>
            <Modal className='modal-content'
                title={editable ? 'Edit Transaction' : 'Add Transaction'}
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={null}
            >
                <Form className='form-item' layout="vertical" onFinish={handleSubmit} initialValues={editable}>
                    <Form.Item className='form-item-label' label="Amount" name="amount" rules={[{ required: true, message: 'Please input the amount!' }]}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please select the category!' }]}>
                        <Select >
                            <Select.Option className='input-field' value="income" >Income</Select.Option>
                            <Select.Option value="expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select the category!' }]}>
                        <Select>
                            <Select.Option value="books">Books</Select.Option>
                            <Select.Option value="bills">Current Bills</Select.Option>
                            <Select.Option value="fee">Fee</Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="groceries">Groceries</Select.Option>
                            <Select.Option value="medical">Medical</Select.Option>
                            <Select.Option value="movie">Movie</Select.Option>
                            <Select.Option value="project">Project</Select.Option>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="shopping">Shopping</Select.Option>
                            <Select.Option value="tax">Tax</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="travel">Travel</Select.Option>
                            <Select.Option value="others">Others</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select the date!' }]}>
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item label="Reference" name="reference" rules={[{ required: true, message: 'Please select the reference' }]}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Mode of Payment" name="payment_method" rules={[{ required: true, message: 'Please select the payment method!' }]}>
                        <Select>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="online_payment">Online Payment</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
                        <Input type="text" />
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <Button className='button-container' type="primary" htmlType="submit">SAVE</Button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default HomePage;
