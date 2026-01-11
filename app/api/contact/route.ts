import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter";

// Validation helpers
const NAME_REGEX = /^[a-zA-Z\s]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[0-9]+$/

const MAX_LENGTHS = {
    name: 50,
    email: 100,
    phone: 20,
    subject: 200,
    message: 2000,
}

export async function POST(request: NextRequest) {
    const rateLimitError = await checkRateLimit("strict");
    if (rateLimitError) return rateLimitError;

    try {
        const body = await request.json()
        const { name, email, phone, subject, message } = body

        // Validate name
        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: "Name is required" }, { status: 400 })
        }
        const trimmedName = name.trim()
        if (!NAME_REGEX.test(trimmedName)) {
            return NextResponse.json({ error: "Name can only contain letters" }, { status: 400 })
        }
        if (trimmedName.length > MAX_LENGTHS.name) {
            return NextResponse.json({ error: `Name is too long (max ${MAX_LENGTHS.name} characters)` }, { status: 400 })
        }

        // Validate email
        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }
        const trimmedEmail = email.trim()
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 })
        }
        if (trimmedEmail.length > MAX_LENGTHS.email) {
            return NextResponse.json({ error: "Email is too long" }, { status: 400 })
        }

        // Validate phone (extract just the number part after country code)
        if (!phone || typeof phone !== 'string') {
            return NextResponse.json({ error: "Phone is required" }, { status: 400 })
        }
        // Phone comes as "+1 1234567890", extract just the number part
        const phoneParts = phone.trim().split(' ')
        const phoneNumber = phoneParts.slice(1).join('') || phoneParts[0]
        if (!PHONE_REGEX.test(phoneNumber)) {
            return NextResponse.json({ error: "Phone can only contain numbers" }, { status: 400 })
        }
        if (phoneNumber.length > MAX_LENGTHS.phone) {
            return NextResponse.json({ error: "Phone number is too long" }, { status: 400 })
        }

        // Validate subject (optional but has max length)
        if (subject && typeof subject === 'string' && subject.trim().length > MAX_LENGTHS.subject) {
            return NextResponse.json({ error: `Subject is too long (max ${MAX_LENGTHS.subject} characters)` }, { status: 400 })
        }

        // Validate message
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }
        const trimmedMessage = message.trim()
        if (trimmedMessage.length > MAX_LENGTHS.message) {
            return NextResponse.json({ error: `Message is too long (max ${MAX_LENGTHS.message} characters)` }, { status: 400 })
        }

        const contactMessage = await prisma.contactMessage.create({
            data: {
                name: trimmedName,
                email: trimmedEmail,
                phone: phone.trim(),
                subject: subject?.trim() || "",
                message: trimmedMessage,
                status: "new",
            },
        })

        return NextResponse.json(contactMessage, { status: 201 })
    } catch (error) {
        console.error("Error creating contact message:", error)
        return NextResponse.json(
            { error: "Failed to submit message" },
            { status: 500 }
        )
    }
}

