
import React from 'react';
import EmailForm from '@/components/EmailForm';
import Header from '@/components/Header';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-10">
      <Header />
      <main className="container px-4">
        <div className="max-w-3xl mx-auto">
          <EmailForm />
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              This is a demo application. In a real implementation, emails would be sent via a backend service.
            </p>
            <p className="mt-2">
              For production use, you would need to connect this to an email sending service or SMTP server.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
