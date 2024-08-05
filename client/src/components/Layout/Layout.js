import React from 'react'
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <div>
                <div className='content'>
                    {children}
                </div>
            </div>
            <Footer />
        </>
    );
};
export default Layout;