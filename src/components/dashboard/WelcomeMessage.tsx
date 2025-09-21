type WelcomeMessageProps = {
  firstName: string;
  organizationName: string;
};

const WelcomeMessage = ({ firstName, organizationName }: WelcomeMessageProps) => {
  return (
    <div className="p-6 text-center mt-8">
      <h1 className="text-2xl font-bold mb-2">Welcome, {firstName}!</h1>
      <p className="">You are viewing the dashboard for {organizationName || "Organization not set"}.</p>
    </div>
  );
};

export default WelcomeMessage;
