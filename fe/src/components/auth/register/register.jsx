import { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/slices/authSlice';
import './register.scss';

function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useSelector((state) => state.auth);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const onSubmit = async (data) => {
        try {
            const resultAction = await dispatch(registerUser(data));
            if (registerUser.fulfilled.match(resultAction)) {
                setSnackbarMessage('Register successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                setSnackbarMessage(resultAction.payload || 'Registration failed');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage('An error occurred during registration');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <section>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="text-center">
                    <h1 className="mt-1 mb-5 pb-1">REGISTER</h1>
                </div>
                <div className="form-outline mb-4">
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        placeholder="Enter your username"
                        {...register('username', { required: 'Username is required' })}
                    />
                    {errors.username && <small className="text-danger">{errors.username.message}</small>}
                </div>
                <div className="form-outline mb-4">
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter your email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'Invalid email'
                            }
                        })}
                    />
                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                </div>
                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Enter your password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Passwords must be at least 6 characters'
                            }
                        })}
                    />
                    {errors.password && <small className="text-danger">{errors.password.message}</small>}
                </div>
                <div className="text-center pt-1 mb-5 pb-1">
                    <button type="submit" className="btn btn-block fa-lg gradient-custom-2 mb-3 btn-login">
                        SIGN UP
                    </button>
                    <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">You have an account?</p>
                        <a href="/login">Sign in</a>
                    </div>
                </div>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </section >
    );
}

export default Register;
