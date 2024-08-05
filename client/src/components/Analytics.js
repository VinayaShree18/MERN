import React from 'react';
import { Progress } from 'antd';
import './Analytics.css'; 

const Analytics = ({ allTransaction }) => {
    const categories = ['bills', 'books', 'fee', 'food', 'groceries', 'medical', 'movie', 'project', 'salary', 'shopping', 'tax', 'tip', 'travel', 'others'];
    
    const totalTransaction = allTransaction.length;
    const totalIncomeTransactions = allTransaction.filter(transaction => transaction.type === "income");
    const totalExpenseTransactions = allTransaction.filter(transaction => transaction.type === "expense");

    const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100;
    const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100;

    const totalTurnover = allTransaction.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalIncomeTurnover = totalIncomeTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalExpenseTurnover = totalExpenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
    const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

    const getCategoryAmounts = (type) => {
        return categories.map(category => {
            const amount = allTransaction
                .filter(transaction => transaction.type === type && transaction.category === category)
                .reduce((acc, transaction) => acc + transaction.amount, 0);
            return { category, amount };
        }).sort((a, b) => b.amount - a.amount);
    };

    const incomeCategories = getCategoryAmounts('income');
    const expenseCategories = getCategoryAmounts('expense');

    return (
        <div className="analytics-container">
            <div className='row m-3'>
                <div className='col-md-4'>
                    <div className='card'>
                        <div className='card-header'>
                            Total Transactions: {totalTransaction}
                        </div>
                        <div className='card-body'>
                            <h5 className='text-success'>Income: {totalIncomeTransactions.length}</h5>
                            <h5 className='text-danger'>Expense: {totalExpenseTransactions.length}</h5>
                            <div>
                                <Progress type='circle' strokeColor={'green'} className='mx-2' percent={totalIncomePercent.toFixed(0)} />
                                <Progress type='circle' strokeColor={'red'} className='mx-2' percent={totalExpensePercent.toFixed(0)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card'>
                        <div className='card-header'>
                            Total Turnover: {totalTurnover}
                        </div>
                        <div className='card-body'>
                            <h5 className='text-success'>Income: {totalIncomeTurnover}</h5>
                            <h5 className='text-danger'>Expense: {totalExpenseTurnover}</h5>
                            <div>
                                <Progress type='circle' strokeColor={'green'} className='mx-2' percent={totalIncomeTurnoverPercent.toFixed(0)} />
                                <Progress type='circle' strokeColor={'red'} className='mx-2' percent={totalExpenseTurnoverPercent.toFixed(0)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6'>
                    <h4>Category-wise Income</h4>
                    {incomeCategories.map(({ category, amount }) => (
                        <div className="card" key={category}>
                            <div className='card-body'>
                                <h5>{category}</h5>
                                <Progress percent={totalIncomeTurnover > 0 ? ((amount / totalIncomeTurnover) * 100).toFixed(0) : 0} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className='col-md-6'>
                    <h4>Category-wise Expense</h4>
                    {expenseCategories.map(({ category, amount }) => (
                        <div className="card" key={category}>
                            <div className='card-body'>
                                <h5>{category}</h5>
                                <Progress percent={totalExpenseTurnover > 0 ? ((amount / totalExpenseTurnover) * 100).toFixed(0) : 0} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
