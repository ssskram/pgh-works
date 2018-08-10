import * as React from 'react'
import { Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import MapContainer from './components/Map/MapContainer'
import Home from './components/Home'
import { Login } from './components/Account/Login'


export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/Map' component={ MapContainer } />
    <Route path='/Account/Login' component={ Login } />
</Layout>;
