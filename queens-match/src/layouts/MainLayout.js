// src/layouts/MainLayout.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FieldToFill from "../components/FieldToFill";

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;
