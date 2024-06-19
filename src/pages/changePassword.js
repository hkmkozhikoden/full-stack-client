import React, { useState } from 'react';
import axios from 'axios'
function changePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const changePassword = () => {
        axios
          .put(
            "http://localhost:3001/auth/changepassword",
            {
              oldPassword: oldPassword,
              newPassword: newPassword,
            },
            {
              headers: {
                accessToken: localStorage.getItem("accessToken"),
              },
            }
          )
          .then((response) => {
            if (response.data.error) {
              alert(response.data.error);
            }
          });
      };
  return (
    <div>
        <h2>change password</h2>
      <input type='text' placeholder='old password...' 
      onChange={(event) =>
      {setOldPassword(event.target.value)}}></input>
      <input type='text' placeholder='new password...'
       onChange={(event) =>{setNewPassword(event.target.value)}}>
       </input>
      <button onClick={changePassword}>save change</button>

    </div>
  )
}

export default changePassword
