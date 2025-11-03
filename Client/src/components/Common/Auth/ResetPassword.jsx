import React, {useState} from 'react'
import axios from 'axios';
import { USER_ROUTES } from '../../Common/db-urls';


const ResetPassword = ({onSuccess}) => {

    const [currentPassword, setCurrentPassword] =  useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if(!currentPassword || !newPassword || !confirmNewPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if(newPassword !== confirmNewPassword) {
            alert('passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            if(!token) {
                alert('No access token found. Please log in again.');
                return;
            }

            await axios.put(USER_ROUTES.resetPassword, {
                currentPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Password reset successfully');
            if(onSuccess) onSuccess();
            localStorage.removeItem('accessToken');
            window.location.href = '/user-login';
            
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleCancel = () => {
        if(onSuccess) onSuccess();
    }   

    return (
    <div className='form-container'>
        <form onSubmit={handleResetPassword}>
            <div>
                <label>Current Password:</label>
                <input 
                type="password"
                value={currentPassword}
                onChange={(e)=> setCurrentPassword(e.target.value)}
                required />
            </div>
            
            <div>
                <label> New Password</label>
                <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required />
            </div>

            <div>
                <label> Confirm New Password</label>
                <input 
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required />
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button type='button' onClick={handleCancel} disabled={isLoading}>Cancel</button>
        </form>
    </div>
  )
}

export default ResetPassword
