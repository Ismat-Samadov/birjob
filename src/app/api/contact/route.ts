// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendContactNotification } from '@/lib/email';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define validation rules
const validateContactForm = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.message || data.message.trim() === '') {
    errors.message = 'Message is required';
  } else if (data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export async function POST(request: NextRequest) {
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
    
    // Basic rate limiting - check if the same email has submitted too many times recently
    const recentSubmissions = await prisma.contactSubmissions.count({
      where: {
        email: data.email.trim(),
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    });
    
    if (recentSubmissions >= 5) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many submissions. Please try again later.' 
        },
        { status: 429 }
      );
    }
    
    // Store contact submission in database
    const contactSubmission = await prisma.contactSubmissions.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'PENDING' // Initial status
      }
    });
    
    // Send email notification
    try {
      await sendContactNotification({
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
        submissionId: contactSubmission.id
      });
      
      // Update status to NOTIFIED after email is sent
      await prisma.contactSubmissions.update({
        where: { id: contactSubmission.id },
        data: { status: 'NOTIFIED' }
      });
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Continue execution - we don't want to fail the API response just because the email failed
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: contactSubmission.id
    });
    
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request' 
      },
      { status: 500 }
    );
  }
}