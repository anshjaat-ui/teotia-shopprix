import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)

export function setupRecaptcha(containerId = 'recaptcha-container') {
  if (window.recaptchaVerifier) {
    return window.recaptchaVerifier
  }

  window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, containerId, {
    size: 'invisible',
    callback: () => {},
    'expired-callback': () => {
      window.recaptchaVerifier = null
    },
  })

  return window.recaptchaVerifier
}

export async function sendPhoneOtp(phoneNumber) {
  const verifier = setupRecaptcha()
  try {
    return await signInWithPhoneNumber(firebaseAuth, phoneNumber, verifier)
  } catch (error) {
    window.recaptchaVerifier = null
    throw error
  }
}
