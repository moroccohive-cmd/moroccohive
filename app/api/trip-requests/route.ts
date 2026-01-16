import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { checkRateLimit } from "@/lib/limiter";
import { auth } from "@/lib/auth";

// Validation helpers
const NAME_REGEX = /^[a-zA-Z\s]+$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[0-9]+$/

const MAX_LENGTHS = {
    fullName: 50,
    email: 100,
    phone: 20,
    desiredExperiences: 2000,
    extraDetails: 3000,
}

export async function POST(request: NextRequest) {
    const rateLimitError = await checkRateLimit("strict");
    if (rateLimitError) return rateLimitError;

    try {
        const body = await request.json()

        // Validate required fields exist
        const requiredFields = [
            "travelStyle",
            "travelDates",
            "arrivalCity",
            "departureCity",
            "accommodation",
            "budget",
            "numberOfTravelers",
            "fullName",
            "email",
            "phone",
        ]

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                )
            }
        }

        // Validate fullName (letters only)
        const trimmedName = body.fullName.trim()
        if (!NAME_REGEX.test(trimmedName)) {
            return NextResponse.json({ error: "Name can only contain letters" }, { status: 400 })
        }
        if (trimmedName.length > MAX_LENGTHS.fullName) {
            return NextResponse.json({ error: `Name is too long (max ${MAX_LENGTHS.fullName} characters)` }, { status: 400 })
        }

        // Validate email format
        const trimmedEmail = body.email.trim()
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }
        if (trimmedEmail.length > MAX_LENGTHS.email) {
            return NextResponse.json({ error: "Email is too long" }, { status: 400 })
        }

        // Validate phone format (extract just the number part after country code)
        const phoneParts = body.phone.trim().split(' ')
        const phoneNumber = phoneParts.slice(1).join('') || phoneParts[0]
        if (!PHONE_REGEX.test(phoneNumber)) {
            return NextResponse.json({ error: "Phone can only contain numbers" }, { status: 400 })
        }
        if (phoneNumber.length > MAX_LENGTHS.phone) {
            return NextResponse.json({ error: "Phone number is too long" }, { status: 400 })
        }

        // Validate number of travelers
        if (isNaN(body.numberOfTravelers) || body.numberOfTravelers < 1) {
            return NextResponse.json(
                { error: "Number of travelers must be at least 1" },
                { status: 400 }
            )
        }

        // Validate travel dates
        const dates = body.travelDates.split(" to ")
        if (dates.length !== 2) {
            return NextResponse.json({ error: "Please provide both start and end dates" }, { status: 400 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const startDate = new Date(dates[0])
        const endDate = new Date(dates[1])

        if (startDate < today) {
            return NextResponse.json({ error: "Start date cannot be in the past" }, { status: 400 })
        }
        if (endDate < today) {
            return NextResponse.json({ error: "End date cannot be in the past" }, { status: 400 })
        }
        if (dates[0] === dates[1]) {
            return NextResponse.json({ error: "Start and end dates cannot be the same" }, { status: 400 })
        }
        if (endDate <= startDate) {
            return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
        }

        // Validate optional text field lengths
        if (body.desiredExperiences && body.desiredExperiences.length > MAX_LENGTHS.desiredExperiences) {
            return NextResponse.json({ error: `Desired experiences is too long (max ${MAX_LENGTHS.desiredExperiences} characters)` }, { status: 400 })
        }
        if (body.extraDetails && body.extraDetails.length > MAX_LENGTHS.extraDetails) {
            return NextResponse.json({ error: `Extra details is too long (max ${MAX_LENGTHS.extraDetails} characters)` }, { status: 400 })
        }

        // Check for session to link user
        const session = await auth.api.getSession({
            headers: request.headers
        })

        // Create trip request
        const tripRequest = await prisma.tripRequest.create({
            data: {
                travelStyle: body.travelStyle,
                travelDates: body.travelDates,
                arrivalCity: body.arrivalCity,
                departureCity: body.departureCity,
                accommodation: body.accommodation,
                budget: body.budget,
                adventureActivities: body.adventureActivities || [],
                experiences: body.experiences || [],
                importantFactors: body.importantFactors || [],
                desiredExperiences: body.desiredExperiences,
                transportation: body.transportation,
                importantCriteria: body.importantCriteria,
                numberOfTravelers: parseInt(body.numberOfTravelers),
                travelerAges: body.travelerAges,
                extraDetails: body.extraDetails,
                fullName: trimmedName,
                email: trimmedEmail,
                phone: body.phone.trim(),
                userId: session?.user?.id,
                preferredPaymentMethod: body.preferredPaymentMethod,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: "Trip request submitted successfully",
                id: tripRequest.id,
            },
            { status: 201 }
        )
    }
    catch (error) {
        console.error("Error creating trip request:", error)
        return NextResponse.json(
            { error: "Failed to submit trip request" },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const tripRequests = await prisma.tripRequest.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json({ tripRequests })
    } catch (error) {
        console.error("Error fetching trip requests:", error)
        return NextResponse.json(
            { error: "Failed to fetch trip requests" },
            { status: 500 }
        )
    }
}

