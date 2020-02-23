
import firebase from 'firebase/app';
// import * as fb from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import {firebaseConfig} from 'app/config';

/*
type QuerySnapshot = fb.firestore.QuerySnapshot;
type QueryDocumentSnapshot = fb.firestore.QueryDocumentSnapshot;
*/
(setTimeout(() => {
    // firebase.fiersote.DocumentSnapshot
    // console.log(fb.firestore.DocumentSnapshot);

    /*
    function processCollectionResponse(response: QuerySnapshot) {
        return response.docs.map((doc: QueryDocumentSnapshot) => ({ ...doc.data(), id: doc.id }))
    }
    */

    (() => {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        // firebase.analytics();
        /*
            firebase.firestore()
                .collection('tempPeople')
                .add({ name: 'Nick'});

            firebase.firestore()
                .collection('tempPeople')
                .get()
                .then(processCollectionResponse)
                .then((response) => {
                    console.log(response);
                });
         */

    })();
}, 2000));
