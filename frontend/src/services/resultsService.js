import axios from "axios";
import config from '../config';

const parseResp = (resp) => {
    const payload = resp.data || {};
    return payload;
};

/**
 * Sends service call to retrieve all the results from swabNseq
 */
export function getAllResults() {
    return axios
        .get(`${config.service}/allresults`)
        .then(resp => { return parseResp(resp) })
        .catch(console.log);
}

/**
 * Sends service call to retrieve the individual results
 */
export const getRecordResults = (id) => {
    return axios.get(`${config.service}/getRecord?id=${id}`)
        .then(parseResp)
        .catch(console.log)
};
