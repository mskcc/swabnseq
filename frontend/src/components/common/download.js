import React from 'react';
import config from '../../config';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

class DownloadFile extends React.Component {
    constructor(props) {
        super(props);
    }

    downloadEmployeeData = (id) => {
        fetch(`${config.service}/download?id=${this.props.sampleId}`)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `swabNseq.csv`;
                    a.click();
                })
            });
    };

    render() {
        return (
            <div id="container">
            <a href="#" onClick={this.downloadEmployeeData}>
            <FontAwesomeIcon className={"download-icon"} icon={faDownload}/>
        </a>
        </div>
    )
    }

}

export default DownloadFile;
