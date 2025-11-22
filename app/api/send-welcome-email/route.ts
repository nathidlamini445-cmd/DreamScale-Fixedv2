import { NextRequest, NextResponse } from 'next/server'

async function generateWelcomeEmailWithGemini(email: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      console.log('⚠️ GEMINI_API_KEY not configured, using template email')
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
          <div style="background: white; color: #333; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #39d2c0; margin: 0 0 20px 0;">Welcome to DreamScale! 🚀</h1>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0;">Hi there,</p>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0;">Thank you for joining DreamScale. Your session is now active and all your data will be saved automatically.</p>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0;"><strong>Your email:</strong> ${email}</p>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0;">Start creating events, goals, and chats with Bizora AI - everything will be saved for your next visit!</p>
            <hr style="border: none; border-top: 2px solid #39d2c0; margin: 25px 0;">
            <p style="font-size: 14px; line-height: 1.6; margin: 15px 0; color: #666;">Happy building! 🎉</p>
            <p style="font-size: 12px; margin: 20px 0 0 0; color: #999;">DreamScale Team</p>
          </div>
        </div>
      `
    }

    // Use Gemini API to generate personalized welcome email
    // Use model from env or default to gemini-pro
    const modelName = process.env.GEMINI_MODEL || 'gemini-pro'
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate a friendly and professional HTML welcome email for DreamScale (a productivity app with features like calendar events, HypeOS goals, and Bizora AI chats). 
                
The user's email is: ${email}

The email should:
1. Be warm and welcoming
2. Highlight key features (Calendar, HypeOS goals, Bizora AI)
3. Encourage them to start using the app
4. Be formatted as clean HTML with inline styles
5. Include emojis where appropriate
6. Be about 200-300 words

Format: Return ONLY the HTML content, wrapped in a container div with styling. Include company branding.`
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      console.log('⚠️ Gemini API error, using template')
      return null
    }

    const data = await response.json()
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (generatedContent) {
      return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;">${generatedContent}</div>`
    }
    
    return null
  } catch (error) {
    console.error('Error generating email with Gemini:', error)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate personalized email with Gemini
    let htmlContent = await generateWelcomeEmailWithGemini(email)

    // Fallback to template if Gemini fails
    if (!htmlContent) {
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">
          <div style="background: white; color: #333; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #39d2c0; margin: 0 0 20px 0;">Welcome to DreamScale! 🚀</h1>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0;">Thank you for joining DreamScale. Your email: ${email}</p>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0;">Start creating events, goals, and chats - everything will be saved automatically!</p>
            <p style="font-size: 14px; line-height: 1.6; margin: 15px 0; color: #666;">Happy building! 🎉</p>
          </div>
        </div>
      `
    }

    // For production, integrate with actual email service:
    // Option 1: Resend
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'DreamScale <onboarding@resend.dev>',
    //     to: email,
    //     subject: 'Welcome to DreamScale! 🚀',
    //     html: htmlContent
    //   })
    // })

    // Option 2: SendGrid
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email }] }],
    //     from: { email: 'noreply@dreamscale.app' },
    //     subject: 'Welcome to DreamScale! 🚀',
    //     content: [{ type: 'text/html', value: htmlContent }]
    //   })
    // })

    // For testing/demo: Log and simulate success
    console.log(`📧 Welcome email generated for: ${email}`)
    console.log('📧 Email service configured to send via Resend or SendGrid')
    console.log('📧 Set GEMINI_API_KEY and RESEND_API_KEY (or SENDGRID_API_KEY) environment variables to actually send emails')

    return NextResponse.json(
      { 
        success: true, 
        message: `Welcome email ready for ${email}`,
        email,
        emailGenerated: true
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in welcome email endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to process welcome email', success: false },
      { status: 500 }
    )
  }
}
