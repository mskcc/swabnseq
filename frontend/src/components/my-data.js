import React, { useState } from "react";
import PieChart from "./graph";
import Card from "../resources/swab_n_seq_card.png";
import {getRecordResults} from "../services/resultsService";
import Update from './common/update';
function MyData(props) {
    const [id, setId] = useState(null);
    const [data, setData] = useState([]);
    const [update, setUpdate] = useState(null);

    const onChange = (evt) => {
        const val = evt.target.value;
        setId(val);
    };

    const getErrorInValue = (val) => {
        if(val === ''){
            return 'Please enter a value'
        }
        if(isNaN(val)){
            return 'Please enter the numerical ID. For instance, enter "23" for "SNS_23"'
        }
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();

        const err = getErrorInValue(id);
        if(err){
            setUpdate(err);
            return;
        }
        setUpdate(`Fetching data for ${id}`);
        getRecordResults(id)
            .then((resp) => {
                if(resp.error){
                    setUpdate(resp.error);
                    return;
                }
                const data = resp.record || [];
                setData(data);
                setUpdate(null);
            })
            .catch(console.log)
    };

    if(data.length > 0) return <div className={"pos-rel"}>
        <PieChart
    sliceList={data}
    sampleId={id}
    width={800}
    height={550}
    showlegend={true}
    level={props.level}
    showDownload={true}/>
    </div>;

    return <div>
    <p>
    To access your data, enter the numerical ID found on your swabNseq card.
        For instance, enter "23" for "SNS_23"</p>
                                     <div className={'sid-card pos-rel'}>
        <form onSubmit={handleSubmit}
    className={'id-entry pos-abs'}>
        <label>
        <p>Enter your ID number: </p>
    </label>
    <input type="text" name="name" className="id-entry-input" onChange={onChange}/>
    <input type="submit" value="Submit" />
        </form>
        <img className={'sid-card inline-block'}
    src={Card}
    alt={'swabNseqIdCard'}/>
    <div className={"update-container"}>
        <Update update={update}/>
    </div>
    </div>
    </div>
}

export default MyData;
