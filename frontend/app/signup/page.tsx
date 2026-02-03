import SignupForm from '../components/SignupForm';

const SigninPage: React.FC = () => {
  return (
    <div className="signup-bg">
      <div
        className="min-h-screen flex items-center justify-center p-4 overflow-hidden"
        style={{ backgroundColor: '#EBEBFF' }}
      >
        <SignupForm />
      </div>
    </div>
  );
};

export default SigninPage;
