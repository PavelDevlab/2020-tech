
import firebase from 'firebase/app';
import * as fb from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import {firebaseConfig} from 'app/config';
import {RegisterValues} from 'app/components/auth/types/RegisterPage';

type QuerySnapshot = fb.firestore.QuerySnapshot;
type QueryDocumentSnapshot = fb.firestore.QueryDocumentSnapshot;
type Firebase = typeof firebase;
type FirebaseConfig = typeof firebaseConfig;
type ApiConfig = {
    fbConfig: FirebaseConfig,
    firebase: Firebase
};

function processCollectionResponse(response: QuerySnapshot) {
    return response.docs.map((doc: QueryDocumentSnapshot) => ({ ...doc.data(), id: doc.id }));
}

class ApiService {

    fb: Firebase;

    constructor({fbConfig, firebase}: ApiConfig) {
        this.fb = firebase;
        this.fb.initializeApp(fbConfig);
    }

    fetchUsers = () => {
        return this.fb.firestore()
            .collection('tempPeople')
            .get()
            .then(processCollectionResponse)
            .then((response) => {
                // eslint-disable-next-line no-console
                console.log(response);
            });
    }

    signUp = ({login: email, password}:RegisterValues) => {
        return this.fb.auth().createUserWithEmailAndPassword(email, password);
    }

/*
    signIn = (email, password) => this.fb.auth().signInWithEmailAndPassword(email, password)
    signUp = (email, password) => this.fb.auth().createUserWithEmailAndPassword(email, password)

    addPerson = (person) => this.fb.firestore()
        .collection('people')
        .add(person)

    fetchPeople = () => this.fb.firestore()
        .collection('people')
        .get()
        .then(processCollectionResponse)

    onPeopleChange = (callback) => this.fb.firestore()
        .collection('people')
        .onSnapshot(data => callback(processCollectionResponse(data)))

    onAuthChange = (callback) => this.fb.auth().onAuthStateChanged(callback)
 */
}



export default new ApiService({fbConfig: firebaseConfig, firebase});





/*
type QuerySnapshot = fb.firestore.QuerySnapshot;
type QueryDocumentSnapshot = fb.firestore.QueryDocumentSnapshot;
*/
// (setTimeout(() => {
//     // firebase.fiersote.DocumentSnapshot
//     // console.log(fb.firestore.DocumentSnapshot);
//
//     /*
//     function processCollectionResponse(response: QuerySnapshot) {
//         return response.docs.map((doc: QueryDocumentSnapshot) => ({ ...doc.data(), id: doc.id }))
//     }
//     */
//
//     (() => {
//         // Initialize Firebase
//         firebase.initializeApp(firebaseConfig);
//         // firebase.analytics();
//         /*
//             firebase.firestore()
//                 .collection('tempPeople')
//                 .add({ name: 'Nick'});
//
//             firebase.firestore()
//                 .collection('tempPeople')
//                 .get()
//                 .then(processCollectionResponse)
//                 .then((response) => {
//                     console.log(response);
//                 });
//          */
//
//     })();
// }, 2000));
