import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import './App.css';
import AllGraphs from './components/all-graphs.js';
import Description from './components/description.js';
import { getAllResults } from "./services/resultsService";
import config from './config.js';

function App() {
    const [summary, setSummary] = useState([]);
    const [results, setResults] = useState([]);

    useEffect( () => {
        getAllResults()
            .then((resp) => {
                const s = resp.summary || {};
                const r = resp.results;
                if(s) setSummary(s);
                if(r) setResults(r);
            })
            .catch(console.log);
    }, []);

    return (
        <div>
        <Router>
        <header className="App-header">
        <div className={"margin-left-40"}>
        <Link className={"header-tab"} to={`${config.root}`}>
<h1 className={'white'}>Data</h1>
        </Link>
        <Link className={"header-tab"} to={`${config.root}about`}>
<h1 className={'white'}>About</h1>
        </Link>
        <div className={'logo-container'}>
        <p className={'logo-text inline-block'}>Integrated Genomics Operation</p>
    <a href={"https://igo.mskcc.org/"} target={"_blank"}>
        <img className={'logo inline-block'}
    src={'https://i.imgur.com/olnUkdu.png'}
    alt={'igo-logo'}/>
    </a>
    </div>
    </div>
    </header>
    <div className={"body-container margin-top-15 padding-hor-5per"}>
        <Switch>
        <Route exact path={`${config.root}`}
    render={(props) =>
<AllGraphs {...props}
    graphs={results}
    summaryGraph={summary}/>
}
    />
    <Route path={`${config.root}about`}
    render={(props) =>
<Description/>
}
    />
    </Switch>
    </div>
    </Router>
    <footer></footer>
    </div>
);
}

export default App;
