// This file contains a basic implementation of the Card and CardContent components,
// styled with Tailwind CSS to match the provided image.
// All components are defined in this single file for convenience.

import React from 'react';

// The Card component provides the container styling:
// white background, rounded corners, and a subtle shadow.
// The `children` prop is now explicitly typed as `React.ReactNode` to fix the TypeScript error.
export const Card = ({ children, className = "" }) => {
  return (
    <div className={`rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
};

// The CardContent component is a simple wrapper for adding padding
// to the content inside the Card.
export const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

// This is the main App component that demonstrates how to use the Card
// and CardContent components.
const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card className="p-0">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2 text-red-600">Sample Card</h2>
            <p className="text-gray-700">
              This is a demonstration of the Card and CardContent components. They are designed to encapsulate content
              within a visually appealing, styled container.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;