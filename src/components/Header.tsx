
import React from "react";
import { Mail } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="py-4 mb-8">
      <div className="container flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-primary animate-bounce-subtle" />
          <h1 className="text-2xl font-bold text-center">Whisper Mail</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
