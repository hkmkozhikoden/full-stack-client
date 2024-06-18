import React from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';

function Registration() {
    const initialValues = {
        username: "",
        password:""
      };
    
      const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),

      });
      const onSubmit = (data) =>{
        axios.post("http://localhost:3001/auth", data).then(() =>{
            console.log(data);
        })
      }
  return (
    <div>
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form className="formContainer">

              <label>Username: </label>
              <ErrorMessage name="username" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                name="username"
                placeholder="Enter username"
              />
                 <label>password: </label>
              <ErrorMessage name="password" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePost"
                type="password"
                name="password"
                placeholder="Enter password"
              />
              <button type="submit"> Register</button>
            </Form>
        </Formik>    
    </div>
  )
}

export default Registration
