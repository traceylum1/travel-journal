import LoginForm from './LoginForm';

function LoginPage() {
    return (
        <div className="flex h-full w-full items-center justify-center p-4 text-amber-50">
            <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-800/80 p-6 shadow-xl backdrop-blur-sm">
                <h1 className="m-0 text-3xl font-semibold tracking-tight">Travel Journal</h1>
                <LoginForm/>
            </div>
        </div>
    )
}

export default LoginPage;