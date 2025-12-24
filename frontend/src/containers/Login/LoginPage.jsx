function LoginPage() {
    return (
        <div className="login-page" style={{color: "antiqueWhite"}}>
            <div className="login-container">
                <h1>Travel Journal</h1>
                <form className="login-form">
                    <label htmlFor="username">Username:</label>
                    <input name="username" required/>
                    <br/>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required/>
                    <div className="login-buttons">
                        <input type="submit" value="Log in"/>
                        <input type="submit" value="Sign Up"/>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}

export default LoginPage;