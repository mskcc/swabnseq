import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, NavLink, Link, Route, Switch } from "react-router-dom";
import './App.css';
import AllGraphs from './components/all-graphs.js';
import Description from './components/description.js';
import PhotoGallery from './components/photo-gallery.js';
import Landing from './components/landing.js';
import ComingSoon from './components/coming-soon.js';
import { getAllResults } from "./services/resultsService";
import config from './config.js';

// Flip to true to re-enable the Swab 'n Seq Results section (Data / About).
// While false, Results shows a "Coming Soon" placeholder and the sub-tabs are hidden.
const RESULTS_READY = false;

function App() {
    const [summary, setSummary] = useState({});
    const [results, setResults] = useState([]);

    useEffect( () => {
        getAllResults()
            .then((resp) => {
                if(resp && resp.summary) {
                    const s = resp.summary || {};
                    const r = resp.graphs || [];
                    if(s) setSummary(s);
                    if(r) setResults(r);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // "Swab 'n Seq Results" top tab is active on both its sub-routes (Data, About).
    const resultsActive = (match, location) =>
        location.pathname.indexOf(`${config.root}results`) === 0 ||
        location.pathname.indexOf(`${config.root}about`) === 0;

    return (
        <div>
        <Router>
        <header className="App-header">
            <div className="margin-left-40 oh-nav">
                <Link className="oh-brand" to={`${config.root}`}>🎃 Open House</Link>
                <nav className="oh-tabs">
                    <NavLink className="oh-tab" activeClassName="active" to={`${config.root}gallery`}>Photo Gallery</NavLink>
                    <NavLink className="oh-tab" activeClassName="active" to={`${config.root}results`} isActive={resultsActive}>Swab 'n Seq Results</NavLink>
                </nav>
                <div className="logo-container">
                    <p className="logo-text inline-block">Integrated Genomics Operation</p>
                    <a href="https://igo.mskcc.org/" target="_blank" rel="noreferrer">
                        <img className="logo inline-block" src="https://i.imgur.com/olnUkdu.png" alt="igo-logo"/>
                    </a>
                </div>
            </div>
        </header>

        {/* Sub-tabs (Data / About) appear only inside Swab 'n Seq Results, and only once it is live. */}
        {RESULTS_READY && (
            <Route path={[`${config.root}results`, `${config.root}about`]}>
                <div className="oh-subnav">
                    <NavLink exact className="oh-subtab" activeClassName="active" to={`${config.root}results`}>Data</NavLink>
                    <NavLink className="oh-subtab" activeClassName="active" to={`${config.root}about`}>About</NavLink>
                </div>
            </Route>
        )}

        <div className={"body-container margin-top-15 padding-hor-5per"}>
            <Switch>
                <Route exact path={`${config.root}`}>
                    <Landing/>
                </Route>
                <Route path={`${config.root}gallery`}>
                    <PhotoGallery/>
                </Route>
                <Route exact path={`${config.root}results`}
                    render={(props) => RESULTS_READY ? <AllGraphs {...props} graphs={results} summaryGraph={summary}/> : <ComingSoon/>}
                />
                <Route path={`${config.root}about`}>
                    {RESULTS_READY ? <Description/> : <ComingSoon/>}
                </Route>
            </Switch>
        </div>
        </Router>
        <footer></footer>
        </div>
    );
}

export default App;
