import React from "react";
import PieChart from "./graph";

function myData(props) {
    return <div>
        <h1 className={'text-align-center'}>{props.sampleName}</h1>
        <PieChart
            sliceList={props.myData}
            sampleId={''}
            width={800}
            height={550}
            showlegend={true}/>
    </div>;
}

export default myData;