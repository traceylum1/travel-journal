function LoginPage() {
    return (
        <div className="login-page" style={{color: "antiqueWhite"}}>
            <div className="login-container">
                <h1>Travel Journal</h1>
                <form className="login-form">
                    <label htmlFor="username">username:</label>
                    <input name="username"/>
                    <br/>
                    <label htmlFor="password">password:</label>
                    <input name="password"/>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;