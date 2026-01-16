import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// Validation functions for backend
// Validation functions for backend
const validateName = (name: string): string | null => {
    // Allow accents and standard name characters
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!name || !name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name is too long (max 50 characters)";
    if (!nameRegex.test(name.trim())) return "Name can only contain letters, spaces, hyphens, and apostrophes";
    return null;
};

const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) return "Email is required";
    if (!emailRegex.test(email.trim())) return "Please enter a valid email";
    if (email.trim().length > 100) return "Email is too long";
    return null;
};

const validatePhone = (phone: string): string | null => {
    const phoneRegex = /^[0-9\s\-+()]+$/;
    if (!phone || !phone.trim()) return "Phone number is required";
    if (phone.trim().length < 6) return "Please enter a valid phone number";
    if (phone.trim().length > 30) return "Phone number is too long";
    if (!phoneRegex.test(phone.trim())) return "Phone can only contain numbers, spaces, and dashes";
    return null;
};



// Shared email template wrapper
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Morocco Hive</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 32px 40px 24px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                            <img src="https://www.moroccohive.com/logo_1.PNG" alt="Morocco Hive" style="height: 50px; width: auto; margin-bottom: 12px;" />
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Gateway to Authentic Morocco</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px 40px;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">Need help? Contact us anytime</p>
                                        <p style="margin: 0;">
                                            <a href="mailto:info@moroccohive.com" style="color: #d58930; text-decoration: none; font-size: 14px;">info@moroccohive.com</a>
                                            <span style="color: #d1d5db; margin: 0 8px;">•</span>
                                            <a href="https://wa.me/212634717423" style="color: #d58930; text-decoration: none; font-size: 14px;">WhatsApp</a>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: center; padding-top: 16px;">
                                        <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                                            © ${new Date().getFullYear()} Morocco Hive. Marrakech, Morocco
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        sendResetPassword: async ({ user, url }) => {
            const content = `
                <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #111827;">Reset Your Password</h2>
                <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                    Hi ${user.name || "there"},
                </p>
                <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                    We received a request to reset your password for your Morocco Hive account. Click the button below to create a new password:
                </p>
                
                <!-- Button -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                    <tr>
                        <td align="center">
                            <a href="${url}" style="display: inline-block; background-color: #d58930; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(213, 137, 48, 0.3);">
                                Reset My Password
                            </a>
                        </td>
                    </tr>
                </table>
                
                <!-- Clickable link fallback -->
                <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280; text-align: center;">
                    Or copy and paste this link into your browser:<br>
                    <a href="${url}" style="color: #d58930; word-break: break-all;">${url}</a>
                </p>
                
                <!-- Security notice -->
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 4px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                        <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact us if you're concerned about your account security.
                    </p>
                </div>
                
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    Happy travels!<br>
                    <strong style="color: #374151;">The Morocco Hive Team</strong>
                </p>
            `;

            await sendEmail({
                to: user.email,
                subject: "Reset Your Password - Morocco Hive",
                html: emailWrapper(content),
            });
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const content = `
                <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #111827;">Welcome to Morocco Hive!</h2>
                <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                    Hi ${user.name || "there"},
                </p>
                <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                    Thank you for joining Morocco Hive! We're thrilled to help you discover the magic of Morocco. Just one more step — please verify your email address to get started:
                </p>
                
                <!-- Button -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                    <tr>
                        <td align="center">
                            <a href="${url}" style="display: inline-block; background-color: #d58930; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(213, 137, 48, 0.3);">
                                Verify My Email
                            </a>
                        </td>
                    </tr>
                </table>
                
                <!-- Clickable link fallback -->
                <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280; text-align: center;">
                    Or copy and paste this link into your browser:<br>
                    <a href="${url}" style="color: #d58930; word-break: break-all;">${url}</a>
                </p>
                
                <!-- What's next -->
                <div style="background-color: #fcf6ef; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #d58930;">What's Next?</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.8;">
                        <li>Explore our curated Morocco tours</li>
                        <li>Plan your dream trip with our experts</li>
                        <li>Save your favorite destinations</li>
                        <li>Get personalized travel recommendations</li>
                    </ul>
                </div>
                
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    If you didn't create an account with us, you can safely ignore this email.
                </p>
                <p style="margin: 16px 0 0; font-size: 14px; color: #6b7280;">
                    See you soon!<br>
                    <strong style="color: #374151;">The Morocco Hive Team</strong>
                </p>
            `;

            await sendEmail({
                to: user.email,
                subject: "Verify Your Email - Welcome to Morocco Hive",
                html: emailWrapper(content),
            });
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 12 * 60 * 60, // Cache session for 12 hours
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
            },
            phone: {
                type: "string",
            },
            bio: {
                type: "string",
            },
            location: {
                type: "string",
            },
        },
        changeEmail: {
            enabled: true,
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // Validate name
                    const nameError = validateName(user.name);
                    if (nameError) {
                        throw new Error(nameError);
                    }

                    // Validate email
                    const emailError = validateEmail(user.email);
                    if (emailError) {
                        throw new Error(emailError);
                    }

                    // Validate phone (if provided via additional fields)
                    const phone = (user as any).phone;
                    if (phone) {
                        const phoneError = validatePhone(phone);
                        if (phoneError) {
                            throw new Error(phoneError);
                        }
                    }

                    return { data: user };
                },
            },
            update: {
                before: async (user) => {
                    // Validate name if being updated
                    if (user.name !== undefined) {
                        const nameError = validateName(user.name);
                        if (nameError) throw new Error(nameError);
                    }

                    // Validate phone if being updated
                    const phone = (user as any).phone;
                    if (phone !== undefined) {
                        if (phone && phone.trim()) {
                            const phoneError = validatePhone(phone);
                            if (phoneError) throw new Error(phoneError);
                        }
                    }

                    return { data: user };
                },
            },
        },
    },
    rateLimit: {
        enabled: true,
        window: 60, // 60 seconds
        max: 100, // 100 requests per window
        customRules: {
            "/sign-in/email": {
                window: 60,
                max: 5, // 5 failed attempts per minute
            },
            "/sign-up/email": {
                window: 60,
                max: 3, // 3 sign-up attempts per minute (prevent spam/bots)
            },
            "/forget-password": {
                window: 60,
                max: 3, // 3 requests per minute (prevent email spam)
            },
        },
    },
});
