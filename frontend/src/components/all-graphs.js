import React, {useState} from 'react';
import PieChart from "./graph";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import {taxonomic_mapping, MAIN_GRAPH_SUMMARY, MAIN_GRAPH_INDIVIDUAL} from '../resources/constants';
import MyData from "./my-data";
import DownloadFile from "./common/download";

function AllGraphs(props) {
    const [level, setLevel] = useState('g');    // Level of classification to use - k, p, c, o , f, g, s
    const [mainGraph, setMainGraph] = useState(MAIN_GRAPH_INDIVIDUAL);  // SUMMARY/INDIVIDUAL
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(9);

    const handleChange = event => {
        setLevel(event.target.value);
    };

    const getSelectors = () => {
        const len = 9;
        const sections = props.graphs.length/len;
        const selectors = [];
        for(let i = 0; i<sections; i++){
            const first = 81+ i*len;
            const last = 81+ ((i+1)*len);
            const f = () => {
                setMin(first);
                setMax(last);
            };

            const selected = (first === min && last === max)? ' selected' : '';
            const selector = <div onClick={f}
            className={"hover graph-section-selector" + selected}
            key={`${first}-${last}`}>
        <p>{first}-{last}</p>
            </div>;
            selectors.push(selector);
        }
        return selectors;
    };

    const getMainGraph = () => {
        if(mainGraph === MAIN_GRAPH_SUMMARY){
            return <PieChart {...props}
            sliceList={props.summaryGraph[level] || []}
            sampleId={""}
            width={850}
            height={550}
            showlegend={true}
            level={level}
            showDownload={false}/>
        }
        return <MyData {...props} level={level}/>
    };

    const handleAlignment = (event, val) => {
        setMainGraph(val);
    };

    const graphTitle = mainGraph === MAIN_GRAPH_SUMMARY ? 'Summary Statistics' : 'My Data';

    return <div>
    <div className={"summary-statistics-container pos-rel"}>
        <Row>
        <Col xs={12} sm={4} className={'toggle-container z-index-1'}>
        <FormControl component="fieldset">
        <FormLabel component="legend">Taxonomic Rank</FormLabel>
    <RadioGroup aria-label="taxonomic-rank" name="taxRank" value={level} onChange={handleChange}>
        <FormControlLabel value="s" control={<Radio/>} label={taxonomic_mapping['s']} />
    <FormControlLabel value="g" control={<Radio />} label={taxonomic_mapping['g']}/>
    <FormControlLabel value="f" control={<Radio />} label={taxonomic_mapping['f']}/>
    <FormControlLabel value="o" control={<Radio />} label={taxonomic_mapping['o']}/>
    <FormControlLabel value="c" control={<Radio />} label={taxonomic_mapping['c']}/>
    <FormControlLabel value="p" control={<Radio />} label={taxonomic_mapping['p']}/>
    </RadioGroup>
    </FormControl>
    <div className={"main-graph-toggle"}>
        <ToggleButtonGroup
    value={mainGraph}
    exclusive
    onChange={handleAlignment}
    aria-label="mainGraph toggle">
        <ToggleButton value="summary" aria-label="mainGraph summary" className={"main-graph-toggle-buttons"}>
        <p className={"margin-0"}>Summary</p>
        </ToggleButton>
        <ToggleButton value="individual" aria-label="mainGraph myData" className={"main-graph-toggle-buttons"}>
        <p className={"margin-0"}>My Data</p>
    </ToggleButton>
    </ToggleButtonGroup>
    </div>
    </Col>
    <Col xs={12} sm={8}
    className={'main-graph-container'}>
        <h1 className={'text-align-center'}>{graphTitle}</h1>
    {getMainGraph()}
</Col>
    </Row>
    </div>
    <div>
    <h1 className={'text-align-center'}>Individual Graphs</h1>
    <p>Below are the annonymized graphs for all sequencing runs of the graph data. They are presented in a random order.</p>
    {getSelectors()}
</div>
    <Row>
    {
        props.graphs.slice(81+min,81+max).map((graph, idx)=>{
            return <Col xs={12} md={6} xl={4}
            key={`Graph-${81+idx}`}
            className={"pos-rel"}>
                <PieChart {...props}
            sliceList={graph}
            sampleId={`Graph-${81+min+idx}`}
            width={340}
            height={550}
            showlegend={false}
            level={level}
            showDownload={false}/>
            </Col>
        })
    }
    </Row>
    </div>
};

export default AllGraphs;
