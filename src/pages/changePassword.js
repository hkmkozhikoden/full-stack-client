import React, { useState } from 'react';
import axios from 'axios';

// Component name starts with an uppercase letter
function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleChangePassword = () => {
        axios.put(
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
        })
        .catch((error) => {
            console.error("Error changing password:", error);
        });
    };

    return (
        <div>
            <h2>Change Password</h2>
            <input
                type='password'
                placeholder='Old Password...'
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
            />
            <input
                type='password'
                placeholder='New Password...'
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
            />
            <button onClick={handleChangePassword}>Save Change</button>
        </div>
    );
}

export default ChangePassword;
