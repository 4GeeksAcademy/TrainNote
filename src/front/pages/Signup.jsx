import "../styles/login.css";
import SignupHeader from "../components/Signup/SignupHeader";
import SignupForm from "../components/Signup/SignupForm";
import SignupFooter from "../components/Signup/SignupFooter";

export const Signup = () => {
  return (
    <main className="signup-page">
      <SignupHeader />
      <SignupForm />
      <SignupFooter />
    </main>
  );
};