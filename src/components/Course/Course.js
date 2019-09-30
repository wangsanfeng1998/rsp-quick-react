import React, { useState} from 'react';
import 'rbx/index.css';
import { Button} from 'rbx';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import { getCourseTerm, hasConflict, timeParts } from './times';

const firebaseConfig = {
    apiKey: "AIzaSyCUz_LlWVunie_Yqaim5f8PETsaLgrJejk",
    authDomain: "quick-react-8bdea.firebaseapp.com",
    databaseURL: "https://quick-react-8bdea.firebaseio.com",
    projectId: "quick-react-8bdea",
    storageBucket: "quick-react-8bdea.appspot.com",
    messagingSenderId: "1008195720143",
    appId: "1:1008195720143:web:f9178cab75b2f2dd30b8ba"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const useSelection = () => {
  const [selected, setSelected] = useState([]);
  const toggle = (x) => {
    setSelected(selected.includes(x) ? selected.filter(y => y !== x) : [x].concat(selected))
  };
  return [ selected, toggle ];
};

const buttonColor = selected => (
  selected ? 'success' : null
);

const getCourseNumber = course => (
  course.id.slice(1, 4)
)


const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const {days} = timeParts(meets);
  if (days) saveCourse(course, meets); 
  else moveCourse(course);
};

const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
};
  
const Course = ({ course, state, user }) => (
  <Button color={ buttonColor(state.selected.includes(course)) }
    onClick={ () => state.toggle(course) }
    onDoubleClick={ user ? () => moveCourse(course) : null }
    disabled={ hasConflict(course, state.selected) }
    >
    { getCourseTerm(course) } CS { getCourseNumber(course) }: { course.title }
  </Button>
);


export default Course;