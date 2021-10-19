import React from 'react';
import PieChart from "./graph";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function AllGraphs(props) {
    return <div>
        <div>
            <h1 className={'text-align-center'}>Summary Statistics</h1>
            <PieChart {...props}
                      sliceList={props.summaryGraph}
                      sampleId={""}
                      width={800}
                      height={550}
                      showlegend={true}/>
        </div>
        <Row>
            {
                props.graphs.map((graph, idx)=>{
                    return <Col xs={12} md={6} lg={4} xl={3}
                                key={`Graph-${idx}`}>
                        <PieChart {...props}
                                  sliceList={graph}
                                  sampleId={`Graph-${idx}`}
                                  width={340}
                                  height={400}
                                  showlegend={false}/>
                    </Col>
                })
            }
        </Row>
    </div>
};

export default AllGraphs;