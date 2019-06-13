# PGH Works

<img src='screenshot.png' width='100%' />

## Structure

### Client
    ...
    ├── ClientApp                         
        ├── components        
            |── Account   
            |── Cards
            |── DeleteConfirmations
            |── Filters
            |── FormElements
            |── Inputs
            |── Lists
            |── Maps
            |── Reports
            |── Timeline
            |── Utilities
            Home.tsx
            Layout.tsx
            NavMenu.tsx
        |── css
        |── functions
        |── store
            |── GETS
            activity.ts
            milestones.ts
            phases.ts
            projects.ts
            subphases.ts
            tags.ts
            tasks.ts
            timeline.ts     

### Server
    ...
    ├── Controllers
        Account.cs
        Activity.cs
        Home.cs
        Log.cs
        Milestones.cs
        Personnel.cs
        Phases.cs
        Ping.cs
        Projects.cs
        Subphases.cs
        TaggableAssets.cs
        Tags.cs
        Tasks.cs
        User.cs
    ├── Models
    ├── Views
    ├── wwwroot
    Program.cs
    Startup.cs

## Running Locally

### Prerequisites

* [.Net Core](https://docs.microsoft.com/en-us/dotnet/core/) - C# runtime
* [Node.js](https://nodejs.org) - JS runtime
* .env - See .env.example for all required secrets

### Installation
```
git clone https://github.com/CityofPittsburgh/pgh-works
cd pgh-works
// first, install dependencies for the server
dotnet restore
// then, install dependencies for the client
npm install
// run it
dotnet run
```

## Deployment

Both staging and production services are hosted in Azure.  Application is deployed directly from github, and can be triggered either (a) through the Azure GUI, (b) through the [CLI](https://docs.microsoft.com/en-us/cli/azure/webapp/deployment/source?view=azure-cli-latest#az-webapp-deployment-source-sync), or (c) through the [proxy service](https://github.com/CityofPittsburgh/azure-proxy).

For complete documentation on the azure environment, see [here](https://github.com/CityofPittsburgh/all-things-azure.git).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details