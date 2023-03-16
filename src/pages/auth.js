import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
    return (
        <div className="auth">
            <Login />
            <Register />
        </div>
    );
};

// In our components folder, we only want components that can be used across several pages
// Login and Registration only has to do with the authentication page, so therefore we have created those on the same (relevant) page

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
                username,
                password
            });

            setCookies("access_token", response.data.token);
            window.localStorage.setItem("userID", response.data.userID);
            navigate('/');
            
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    };

    return (
        <Form
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            label='Login'
            onSubmit={onSubmit}
            onKeyPress={handleKeyPress}
        />
    );
};


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/auth/register', {
                username,
                password
            });
            alert('Registered Successfully! Now you may login.')
        } catch (err) {
            console.error(err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    };

    return (
        <Form
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            label='Register'
            onSubmit={onSubmit}
            onKeyPress={handleKeyPress}
        />
    );
};



const Form = ({
    username,
    setUsername,
    password,
    setPassword,
    label,
    onSubmit
}) => {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={onSubmit}>
                <h2> {label} </h2>
                <div className="form-group">
                    <label htmlFor="username"> Username: </label>
                    <input
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"> Password: </label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>

                <button type="submit"> {label} </button>
            </form>
        </div>
    );
};