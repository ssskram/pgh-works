import * as React from 'react'
import { Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './components/Home'
import { Login } from './components/Account/Login'
import NewProject from './components/NewProject/NewProject'


export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route exact path='/NewProject' component={ NewProject } />
    <Route path='/Account/Login' component={ Login } />
</Layout>;
