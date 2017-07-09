import React ,{Component} from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../actions';
import axios from 'axios';
const ROOT_URL='https://i7san-api.herokuapp.com';

// TEMP
// Will be populated from the server, set by admins
// exaxt data structure to be determined
// const activities = [
//   {
//     displayName: "Donate Blood",
//     value: 'donate_blood',
//     points: 20
//   },
//   {
//     displayName: "Beach Clean up",
//     value: 'beach_cleanup',
//     points: 5
//   },
//   {
//     displayName: 'Elderly Home',
//     value: 'elderly_home',
//     points: 25
//   },
//   {
//     displayName: 'Charity Drive',
//     value: 'charity_drive',
//     points: 10
//   }
// ]
let activities=[];


 
//Not sure what to do?
 //componentDidMount= function(){

axios.get(`${ROOT_URL}/activities`)
.then(response => {
activities=response.data;

});
//}



// validation function, tests each field on change
const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Please select an activity'
  }
  if (!values.hours) {
    errors.hours = 'Please the number of hours you volunteered'
  }
  if (!values.description) {
    errors.description = 'Please enter a short description of your volunteering activity'
  }
  
  return errors;
}

// renders each text field
const renderField = ({
  input,
  label,
  type,
  placeholder,
  textarea,
  meta: { touched, error, warning }
}) => (
  <div>
    {textarea 
      ? <textarea {...input} placeholder={placeholder}></textarea>
      : <input {...input} type={type} />
    }
    {touched && 
    (error && <span>{error}</span>)}
  </div>
);

// renders select element
const renderSelectField = ({ input, type, meta: { touched, error }, children }) => (
  <div>
    <select {...input}>
      {children}
    </select>
    {touched && error && <span>{error}</span>}
  </div>
);

const VolunteerForm = (props) => {
  const handleFormSubmit = (fields) => {
    props.recordVolunteerActivity({...fields})
  }

  const renderOptions = () => {
    const optionsList = activities.map(activity => 
      <option 
        key={activity.shortUrl} 
        value={activity.shortUrl}>
        {activity.name} - {activity.points} Points / Hour
      </option>)
    
    // add blank first option, acts as placeholder text for select field component
    optionsList.unshift(
      <option key='title' value='' selected>Volunteer Activity</option>
    );
    return optionsList;
  }

  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* form body */}
      <div>
        <Field placeholder='Volunteer Activity' name='name' component={renderSelectField} required>
          {renderOptions()}
        </Field>

      </div>
      <div>
        <Field placeholder='Number of Hours' name='hours' component={renderField} type='number' />
      </div>
      <div>
        <Field placeholder='Short Description' name='description' textarea={true} component={renderField} />
      </div>
      {/*

      File upload not working yet
      TODO: Make functioning file upload

      <div>
        <Field name='mediaUrl' component='input' type='file' />
      </div>
      
      */}
      <button type='submit'>Record Your Volunteering</button>
    </form>
  );
  
}

export default connect(null, actions)(
  reduxForm({
    form: 'volunteer',
    validate,
    enableReinitialize : true
  })(VolunteerForm)
);