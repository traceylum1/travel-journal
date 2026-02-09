import LoginForm from './LoginForm';

function LoginPage() {
    return (
        <div className="login-page" style={{color: "antiqueWhite"}}>
            <div className="login-container">
                <h1>Travel Journal</h1>
                <LoginForm/>
            </div>
        </div>
    )
}

export default LoginPage;