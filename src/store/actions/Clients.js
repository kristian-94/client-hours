import {BACKEND_URL} from '../../constants/AppConstants'
import axios from 'axios';
import * as config from '../../constants/AppConstants'
export const SET_CLIENTDATA = 'SET_CLIENTDATA';
export const FETCH_CLIENT = 'FETCH_CLIENT';

// Here we fetch all high level client data and put that into our redux state.
export const fetchClients = () => {
    return async (dispatch) => {
        // Execute any async code before dispatching the action.
        const response = await axios.get(BACKEND_URL + 'clients', config.CONFIG_JSON);
        if (response.status !== 200) {
            throw new Error('Didnt get 200 response when fetching clients');
        }
        dispatch({type: SET_CLIENTDATA, clients: response.data})
    };
}

// Client Actions.
// Here we fetch all individual client data from each table and put that into our redux state.
export const fetchClient = (clientid) => {
    console.log('fetching client data all again for client ' + clientid)
    return async (dispatch) => {
        // Collect all data to do with this client.
        const responseClient = await axios.get(BACKEND_URL + 'clients/' + clientid, config.CONFIG_JSON);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when fetching clients');
        }
        dispatch({type: FETCH_CLIENT, activeClient: responseClient.data.client})
    };
}

export const updateClientNote = (clientid, clientNote) => {
    return async (dispatch) => {
        const notedata = {
            note: clientNote
        };
        const responseClient = await axios.put(BACKEND_URL + 'clients/' + clientid, notedata, config.CONFIG_JSON_CONTENT);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when updating client ');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid))
    };
}

// Bucket Actions.
export const createBucket = (clientid, newbucketname) => {
    return async (dispatch) => {
        const data = {
            clientid: clientid,
            name: newbucketname,
        };
        const responseClient = await axios.post(BACKEND_URL + 'buckets', data, config.CONFIG_JSON_CONTENT);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when creating bucket, got: ' + responseClient.status);
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid));
    };
}

export const deleteBucket = (bucket) => {
    return async (dispatch) => {
        const responseClient = await axios.delete(BACKEND_URL + 'buckets/' + bucket.id, config.CONFIG_JSON_CONTENT);
        if (responseClient.status !== 204) {
            throw new Error('Didnt get 204 response when updating bucket name');
        }
        dispatch(fetchClient(bucket.clientid));
    };
}

export const updateBucket = (bucket, data) => {
    return async (dispatch) => {
        const responseClient = await axios.put(BACKEND_URL + 'buckets/' + bucket.id, data, config.CONFIG_JSON_CONTENT);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when updating bucket name');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(bucket.clientid))
    };
}

export const addCommunication = (communications, newcommtext, date) => {
    return async (dispatch, getState) => {
        const clientid = getState().clients.activeClient.id;
        const data = {
            note: newcommtext,
            date: date,
            clientid: clientid,
        };
        const responseClient = await axios.post(BACKEND_URL + 'communications', data, config.CONFIG_JSON_CONTENT);
        if (responseClient.status !== 201) {
            throw new Error('Didnt get 201 response when creating communication record');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid))
    };
}

export const deleteCommunication = (communications, commid) => {
    return async (dispatch, getState) => {
        const clientid = getState().clients.activeClient.id;
        const responseClient = await axios.delete(BACKEND_URL + 'communications/' + commid, config.CONFIG_JSON_CONTENT);
        if (responseClient.status !== 204) {
            throw new Error('Didnt get 204 response when deleting communication record');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid))
    };
}

export const updateHoursData = (hoursid, column, newvalue) => {
    return async (dispatch, getState) => {
        const clientid = getState().clients.activeClient.id;
        let data = {};
        data[column] = newvalue;
        const responseClient = await axios.put(BACKEND_URL + 'hours/' + hoursid, data, config.CONFIG_JSON_CONTENT);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when updating an hours record');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid))
    };
}