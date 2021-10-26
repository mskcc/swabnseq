import React from 'react';

function Update(props) {
    if(props.update){
        return <div className={"update"}><p>{props.update}</p></div>;
    }
    return <div></div>
};

export default Update;
