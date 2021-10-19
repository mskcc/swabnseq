import React from 'react';
import Plot from 'react-plotly.js';

function PieChart(props) {
    const counts = [];
    const orgs = [];
    for(const slice of props.sliceList){
        orgs.push(slice['org']);
        counts.push(slice['count']);
    }
    return (
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
                title: `${props.sampleId}`,
                showlegend: props.showlegend
            } }
            className={'hor-align'}
        />
    );
};

export default PieChart;