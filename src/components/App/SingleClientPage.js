import React, {useEffect, useRef, useState} from 'react';
import AddBucketForm from "./AddBucketForm";
import EditClientForm from "./EditClientForm";
import Bucket from "./Bucket";

const SingleClientPage = ({clientID, firebase}) => {
    const [addingNewBucket, setAddingNewBucket] = useState(false);
    const [editingClient, setEditingClient] = useState(false);
    const [bucketsData, setBucketsData] = useState([]);
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [clientData, setClientData] = useState({});

    useEffect(() => {
        // Got to reset some state when switching clients.
        setAddingNewBucket(false);
        setBucketsData([]);
    }, [clientID]);


    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);
    useEffect(() => {
        firebase.buckets(clientID).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                const bucketsDataObject = snapshot.val();
                if (bucketsDataObject === null) {
                    // No buckets in this client yet.
                    setBucketsData([]);
                    return;
                }
                const bucketsData = Object.keys(bucketsDataObject)
                    .map(key => ({
                        ...bucketsDataObject[key],
                        bucketID: key,
                    }));
                // Make alphabetical order.
                bucketsData.sort((bucket1, bucket2) => bucket1['name'] - bucket2['name']);
                setBucketsData(bucketsData);
            }
        });
        firebase.client(clientID).on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                const clientDataObject = snapshot.val();
                if (clientDataObject === null) {
                    // No buckets in this client yet.
                    return;
                }
                delete clientDataObject.buckets;
                const clientData = {
                    'name': clientDataObject.name,
                    'clientID': clientID
                };
                setClientData(clientData);
            }
        });
    }, [clientID, firebase]);

    const onCreateBucket = () => {
        setAddingNewBucket(true);
    }
    const onEditClient = () => {
        setEditingClient(true);
    }

    const onBackToClientPage = () => {
        setAddingNewBucket(false);
        setEditingClient(false);
    }
    const onDeleteClient = () => {
        firebase.doDeleteClient(clientID).then(() => onBackToClientPage());
    }

    if (addingNewBucket) {
        return (
            <div>
                <AddBucketForm clientID={clientID} onFinishSubmission={onBackToClientPage}/>
            </div>
        );
    }

    if (editingClient) {
        return (
            <div>
                <EditClientForm onDeleteClient={onDeleteClient} clientData={clientData} onFinishSubmission={onBackToClientPage}/>
            </div>
        );
    }

    return (
        <div>
            <button onClick={onCreateBucket} className="btn btn-primary m-1 float-right" type="submit">Create a bucket</button>
            <button onClick={onEditClient} className="btn btn-secondary m-1 float-right" type="submit">Edit Client</button>
            <div className="h1">
                {clientData.name}
            </div>
            <div>
                {bucketsData && bucketsData.map(bucket => {
                    return (
                        <div key={bucket.bucketID}>
                            <Bucket clientID={clientID} bucket={bucket} firebase={firebase}/>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default SingleClientPage;