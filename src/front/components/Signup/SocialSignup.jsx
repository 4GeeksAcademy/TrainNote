import google from '../../assets/google.svg'
import facebook from '../../assets/facebook.svg'
import apple from '../../assets/apple.svg'

const SocialSignup = () => {
    return (
        <div className="social-login">
            <span className="divider">O CONTINUAR CON:</span>

            <div className="social-buttons">
                <button>
                    <img src={google} alt="Google icon" width="20" height="20" />
                    Google
                </button>
                <button>
                    <img src={facebook} alt="Facebook icon" width="20" height="20" />
                    Facebook
                </button>
                <button>
                    <img src={apple} alt="Apple icon" width="20" height="20" />
                    Apple
                </button>
            </div>
        </div>
    );
};

export default SocialSignup;