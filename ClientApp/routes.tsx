import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import MapContainer from './components/Map/MapContainer';
import Home from './components/Home';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/Map' component={ MapContainer } />
</Layout>;
