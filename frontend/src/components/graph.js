import React from 'react';
import Plot from '../../node_modules/react-plotly.js/react-plotly';
import { taxonomic_mapping } from "../resources/constants";
import DownloadFile from "./common/download";

function PieChart(props) {
    // Only use slices that have been identified at the input taxonomic level
    const slices = props.sliceList.filter((entry) => {
        return entry.org[props.level];
    });

    const title = props.sampleId;

    if(slices.length === 0){
        const identifier = title !== '' ? `for ${title} ` : '';

        return <div className={"center pos-abs"}>
            <p className={"text-align-center"}>No data {identifier}at {taxonomic_mapping[props.level]} level</p>
        </div>
    }

    const counts = [];
    const orgs = [];
    for(const slice of slices){
        orgs.push(slice['org'][props.level]);
        counts.push(slice['count']);
    }

    const showDownload = () => {
        if(!props.showDownload) return <div></div>
        return <div className={"download-container"}>
            <DownloadFile sampleId={props.sampleId}/>
        </div>


    };

    return (
        <div>
        <Plot
    data={[
            {
                type: 'pie',
                values: counts,
                labels: orgs,
            },
]}
    layout={ {
        width: props.width,
            height: props.height,
            title: title,
            showlegend: props.showlegend
    } }
    className={'hor-align'}
    />
    {showDownload()}
</div>
);
};

export default PieChart;
