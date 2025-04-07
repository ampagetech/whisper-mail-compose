
interface EmailData {
  to: string;
  message: string;
  attachments?: File[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sendEmail = async (data: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, you would connect to a backend service or API
    // that handles the actual email sending via SMTP
    console.log('Sending email to:', data.to);
    console.log('Message:', data.message);
    
    if (data.attachments && data.attachments.length > 0) {
      console.log('Attachments:', data.attachments.map(file => file.name).join(', '));
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would integrate with a service like EmailJS, SendGrid,
    // or create a backend API endpoint to handle SMTP connection
    
    return { 
      success: true, 
      message: 'Email sent successfully! (This is a simulation)' 
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      message: 'Failed to send email. Please try again.'
    };
  }
};
