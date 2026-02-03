import LoginForm from './components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="login-bg">
      <div
        className="min-h-screen flex items-center justify-center p-4 overflow-hidden"
        style={{ backgroundColor: '#EBEBFF' }}
      >
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
