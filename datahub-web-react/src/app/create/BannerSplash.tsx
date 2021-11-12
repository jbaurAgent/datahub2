// import React, { useState } from 'react';
// import { Card, Layout, Typography } from 'antd';
// import styled from 'styled-components';
// import { Content } from 'antd/lib/layout/layout';
// import { SearchablePage } from '../search/SearchablePage';
// import Cookies from 'js-cookie';
// import axios from 'axios'
import React from 'react';
import 'antd/dist/antd.css';
import { Alert } from 'antd';

export const BannerSplash = () => {
    const onClose = (e) => {
        console.log(e, 'I was closed.');
    };
    // function getTime() {
    //     const date = Date.now();
    //     return date;
    // }
    // const checkCookie = () => {
    //     const userTime = Cookies.get('catalog_announcement_time')
    // }
    // const getContent = () => {
    //     return "hello world! in the banner"
    // }
    // https://ant.design/components/alert/#components-alert-demo-closable
    return <Alert message="Breaking News" description="banner" type="error" closable onClose={onClose} />;
};
