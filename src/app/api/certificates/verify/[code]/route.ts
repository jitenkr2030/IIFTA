import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const verificationCode = params.code

    // Try to find certificate by ID or verification code
    const certificate = await db.certificate.findFirst({
      where: {
        OR: [
          { certificateId: verificationCode },
          { verificationCode: verificationCode }
        ]
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        },
        program: true,
        enrollment: {
          include: {
            student: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!certificate) {
      return NextResponse.json(
        { 
          isValid: false,
          certificate: null,
          message: 'Certificate not found. Please check the certificate ID and try again.',
          verificationDate: new Date().toISOString()
        },
        { status: 404 }
      )
    }

    // Check if certificate is expired
    const isExpired = certificate.expiryDate 
      ? new Date(certificate.expiryDate) < new Date() 
      : false

    // Check if certificate is active
    const isActive = certificate.status === 'ACTIVE' && !isExpired

    // Increment view count
    await db.certificate.update({
      where: { id: certificate.id },
      data: {
        views: {
          increment: 1
        }
      }
    })

    // Create verification record
    await db.verification.create({
      data: {
        certificateId: certificate.id,
        verificationCode: verificationCode,
        isValid: isActive,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        verifiedAt: new Date()
      }
    })

    // Generate verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationCode}`

    const result = {
      isValid: isActive,
      certificate: {
        ...certificate,
        verificationUrl,
        qrCodeUrl: certificate.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}&format=png`,
        pdfUrl: certificate.pdfUrl || `${process.env.NEXT_PUBLIC_APP_URL}/api/certificates/${certificate.id}/pdf`,
        status: isExpired ? 'EXPIRED' : certificate.status
      },
      message: isActive 
        ? 'Certificate is valid and authentic.' 
        : isExpired 
          ? 'Certificate has expired. Please contact the issuer for renewal.'
          : 'Certificate is not valid or has been revoked.',
      verificationDate: new Date().toISOString()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error verifying certificate:', error)
    return NextResponse.json(
      { 
        isValid: false,
        certificate: null,
        message: 'An error occurred during verification. Please try again.',
        verificationDate: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}