import * as React from 'react'
import { Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './components/Home'
import { Login } from './components/Account/Login'
import NewProject from './components/NewProject/Container'
import ProgramsFunds from './components/ProgramsFunds/ProgramsFunds'
import AllProjects from './components/ProjectLists/AllProjects'
import MyProjects from './components/ProjectLists/MyProjects'
import Timeline from './components/Timeline/Container'
import ProjectRecord from './components/Project/Container'

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route exact path='/NewProject' component={ NewProject } />
    <Route exact path='/Programs' component={ ProgramsFunds } />
    <Route exact path='/AllProjects' component={ AllProjects } />
    <Route exact path='/MyProjects' component={ MyProjects } />
    <Route exact path='/Timeline' component={ Timeline } />
    <Route exact path='/Project/id=:id' component={ ProjectRecord } />
    <Route path='/Account/Login' component={ Login } />
</Layout>;
