"use client"

import { useState, useEffect } from "react"
import { auth } from "../firebase/config"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import toast from "react-hot-toast"
import { Phone, Check, X } from "lucide-react"

const PhoneVerification = ({ phoneNumber, onVerified, onCancel }) => {
  const [confirmationResult, setConfirmationResult] = useState(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Mock verification code - in a real app this would come from Firebase
  const [mockCode, setMockCode] = useState("")

  useEffect(() => {
    // Set up invisible reCAPTCHA
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved, allow sending OTP
      },
    })

    return () => {
      // Clean up
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
      }
    }
  }, [])

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const formatPhoneNumber = (phone) => {
    // Format phone number to E.164 format (required by Firebase)
    const digits = phone.replace(/\D/g, "")

    if (!digits.startsWith("1") && !digits.startsWith("+1")) {
      return `+1${digits}` // Assuming US phone numbers
    } else if (!digits.startsWith("+")) {
      return `+${digits}`
    }

    return phone
  }

  const sendVerificationCode = async () => {
    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber)
      setIsVerifying(true)

      const appVerifier = window.recaptchaVerifier
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier)

      setConfirmationResult(result)
      setIsCodeSent(true)
      setCountdown(60) // 60 seconds countdown for resend
      toast.success("Verification code sent to your phone!")
    } catch (error) {
      console.error("Error sending verification code:", error)
      toast.error(error.message || "Failed to send verification code")

      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        })
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code")
      return
    }

    try {
      setIsVerifying(true)

      // Confirm the verification code
      await confirmationResult.confirm(verificationCode)

      // Call the onVerified callback to inform parent component
      onVerified(phoneNumber)
      toast.success("Phone number verified successfully!")
    } catch (error) {
      console.error("Error verifying code:", error)
      toast.error("Invalid verification code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Verify Your Phone Number</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Phone className="h-5 w-5 text-gray-500 mr-2" />
            <span className="font-medium">{phoneNumber}</span>
          </div>
          <p className="text-sm text-gray-600">
            {isCodeSent
              ? "Enter the 6-digit code sent to your phone"
              : "We will send a verification code to this number"}
          </p>
        </div>

        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container"></div>

        {!isCodeSent ? (
          <>
            <button
              onClick={sendVerificationCode}
              disabled={isVerifying}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isVerifying ? "Sending..." : "Send Verification Code"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={verifyCode}
                disabled={isVerifying || verificationCode.length !== 6}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center justify-center"
              >
                {isVerifying ? (
                  "Verifying..."
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Verify
                  </>
                )}
              </button>

              <button
                onClick={sendVerificationCode}
                disabled={isVerifying || countdown > 0}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              >
                {countdown > 0 ? `Resend (${countdown}s)` : "Resend Code"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PhoneVerification

