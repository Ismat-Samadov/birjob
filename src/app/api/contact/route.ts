// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendContactNotification } from '@/lib/email';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define the contact form data interface
interface ContactFormData {
  name?: string;
  email?: string;
  message?: string;
  [key: string]: unknown;
}

// Response interfaces for better type safety
interface ValidationError {
  success: false;
  errors: Record<string, string>;
}

interface SuccessResponse {
  success: true;
  message: string;
  submissionId: number;
}

interface ErrorResponse {
  success: false;
  message: string;
}

// Define validation rules
const validateContactForm = (data: ContactFormData) => {
  const errors: Record<string, string> = {};
  
  // Validate name field
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }
  
  // Validate email field
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  } else if (data.email.trim().length > 255) {
    errors.email = 'Email must be less than 255 characters';
  }
  
  // Validate message field
  if (!data.message || data.message.trim() === '') {
    errors.message = 'Message is required';
  } else if (data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  } else if (data.message.length > 5000) {
    errors.message = 'Message must be less than 5000 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Check for rate limiting
const checkRateLimiting = async (email: string): Promise<{ allowed: boolean, message?: string }> => {
  try {
    const recentSubmissions = await prisma.contactSubmissions.count({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    });
    
    if (recentSubmissions >= 5) {
      return {
        allowed: false,
        message: 'Too many submissions. Please try again later.'
      };
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return { allowed: true }; // Allow on error to prevent blocking legitimate requests
  }
};

// Main POST handler
export async function POST(request: NextRequest): Promise<NextResponse<SuccessResponse | ValidationError | ErrorResponse>> {
  try {
    // Parse JSON body
    const data = await request.json();
    
    // Validate the form data
    const validation = validateContactForm(data);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }
    
    // Ensure data is properly trimmed
    const sanitizedName = data.name?.trim() || '';
    const sanitizedEmail = data.email?.trim() || '';
    const sanitizedMessage = data.message?.trim() || '';
    
    // Check rate limiting
    const rateLimitCheck = await checkRateLimiting(sanitizedEmail);
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: rateLimitCheck.message || 'Too many submissions. Please try again later.' 
        },
        { status: 429 }
      );
    }
    
    // Store contact submission in database
    const contactSubmission = await prisma.contactSubmissions.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'PENDING' // Initial status
      }
    });
    
    // Send email notification
    try {
      await sendContactNotification({
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        submissionId: contactSubmission.id
      });
      
      // Update status to NOTIFIED after email is sent
      await prisma.contactSubmissions.update({
        where: { id: contactSubmission.id },
        data: { status: 'NOTIFIED' }
      });
    } catch (error) {
      console.error('Error sending notification email:', error);
      
      // Update status to ERROR if email fails
      await prisma.contactSubmissions.update({
        where: { id: contactSubmission.id },
        data: { status: 'EMAIL_FAILED' }
      });
      
      // Continue execution - we don't want to fail the API response just because the email failed
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: contactSubmission.id
    });
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Error handling contact form submission:', error);
    
    // Log detailed error for debugging but return a generic message to the user
    const errorMessage = error instanceof Error 
      ? `Form submission error: ${error.message}`
      : 'Unknown error in form submission';
    
    console.error(errorMessage);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request. Please try again later.'
      },
      { status: 500 }
    );
  }
}