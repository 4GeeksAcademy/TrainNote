import "../styles/login.css";
import LoginHeader from "../components/LogIn/LoginHeader";
import LoginForm from "../components/LogIn/LoginForm";
import SocialLogin from "../components/LogIn/SocialLogin";
import LoginFooter from "../components/LogIn/LoginFooter";

export const Login = () => {
    return (
        <main className="login-page">
            <LoginHeader />
            <LoginForm />
            {/* <SocialLogin /> */}
            <LoginFooter />
        </main>
    );
};
