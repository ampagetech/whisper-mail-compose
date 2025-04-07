
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Paperclip, Send, X } from 'lucide-react';
import { sendEmail, validateEmail } from '@/utils/emailService';
import FileAttachment from './FileAttachment';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ATTACHMENTS = 3;

const EmailForm: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validate message
    if (!message.trim()) {
      setMessageError('Message cannot be empty');
      isValid = false;
    } else {
      setMessageError('');
    }
    
    return isValid;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    
    // Check if adding new files would exceed the limit
    if (attachments.length + newFiles.length > MAX_ATTACHMENTS) {
      toast({
        title: "Too many attachments",
        description: `You can only attach up to ${MAX_ATTACHMENTS} files`,
        variant: "destructive"
      });
      return;
    }
    
    // Filter out files that are too large
    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB limit`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await sendEmail({
        to: email,
        message,
        attachments
      });
      
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        
        // Reset form
        setEmail('');
        setMessage('');
        setAttachments([]);
      } else {
        toast({
          title: "Failed to send email",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <span>Compose Email</span>
        </CardTitle>
        <CardDescription>
          Send an email message with optional attachments
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={emailError ? 'text-destructive' : ''}>
              Recipient Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="recipient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {emailError && <p className="text-destructive text-sm">{emailError}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className={messageError ? 'text-destructive' : ''}>
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={messageError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {messageError && <p className="text-destructive text-sm">{messageError}</p>}
          </div>
          
          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <FileAttachment
                    key={`${file.name}-${index}`}
                    file={file}
                    onRemove={() => removeAttachment(index)}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachments.length >= MAX_ATTACHMENTS || isSubmitting}
              className="file-input"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach Files
              <span className="text-xs text-muted-foreground ml-2">
                ({attachments.length}/{MAX_ATTACHMENTS})
              </span>
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Max file size: 5MB
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setEmail('');
              setMessage('');
              setAttachments([]);
              setEmailError('');
              setMessageError('');
            }}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="relative"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmailForm;
