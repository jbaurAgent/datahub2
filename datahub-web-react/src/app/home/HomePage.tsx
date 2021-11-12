import React from 'react';
import { HomePageHeader } from './HomePageHeader';
import { HomePageBody } from './HomePageBody';
import { BannerSplash } from '../create/BannerSplash';

export const HomePage = () => {
    return (
        <>
            <BannerSplash />
            <HomePageHeader />
            <HomePageBody />
        </>
    );
};
