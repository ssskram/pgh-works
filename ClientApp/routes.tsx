import * as React from 'react'
import { Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import Home from './components/Home'
import { Login } from './components/Account/Login'
import ProjectDefinition from './components/ProjectDefinition/Container'
import ProgramsFunds from './components/Drawdowns/ProgramsFunds'
import AllProjects from './components/Lists/AllProjects'
import AllPhases from './components/Lists/AllPhases'
import AllAssets from './components/Lists/AllAssets'
import MyProjects from './components/Lists/MyProjects'
import Timeline from './components/Timeline/Container'
import ProjectRecord from './components/Project/Container'
import PhaseRecord from './components/Phase/Container'
import ProgramFund from './components/Drawdowns/FundViewer'
import AssetReport from './components/TaggableAssets/AssetReport'

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route exact path='/ProjectDefinition' component={ ProjectDefinition } />
    <Route exact path='/Programs' component={ ProgramsFunds } />
    <Route exact path='/AllProjects' component={ AllProjects } />
    <Route exact path='/AllPhases' component={ AllPhases } />
    <Route exact path='/AllAssets' component={ AllAssets } />
    <Route exact path='/MyProjects' component={ MyProjects } />
    <Route exact path='/Timeline' component={ Timeline } />
    <Route exact path='/Project/id=:id' component={ ProjectRecord } />
    <Route exact path='/Phase/id=:id' component={ PhaseRecord } />
    <Route exact path='/Fund/id=:id' component={ ProgramFund } />
    <Route exact path='/Asset/id=:id' component={ AssetReport } />
    <Route exact path='/Asset/street=:street' component={ AssetReport } />
    <Route path='/Account/Login' component={ Login } />
</Layout>;
