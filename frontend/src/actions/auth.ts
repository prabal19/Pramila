'use server';

import * as z from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function registerAndSendOtp(values: z.infer<typeof registerSchema>) {
  try {
    const validatedValues = registerSchema.safeParse(values);
    if (!validatedValues.success) {
        return { success: false, message: 'Invalid input.' };
    }

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedValues.data),
      cache: 'no-store',
    });

    if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.errors[0]?.msg || 'Registration failed.' };
    }

    return { success: true, message: 'OTP sent to your email.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An unexpected error occurred. Please ensure the backend is running.' };
  }
}

export async function verifyOtp(email: string, otp: string) {
    try {
        if (!email || !otp) {
            return { success: false, message: 'Email and OTP are required.' };
        }

        const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { success: false, message: errorData.errors[0]?.msg || 'OTP verification failed.' };
        }

        return { success: true, message: 'You have successfully signed up.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function resendOtp(email: string) {
    try {
        if (!email) {
            return { success: false, message: 'Email is required.' };
        }
        const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { success: false, message: errorData.errors[0]?.msg || 'Failed to resend OTP.' };
        }
        return { success: true, message: 'A new OTP has been sent.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export async function loginUser(values: z.infer<typeof loginSchema>) {
    try {
        const validatedValues = loginSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }

        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.errors[0]?.msg || 'Login failed.' };
        }

        return { success: true, user: data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred. Please ensure the backend is running.' };
    }
}

const updateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export async function updateUser(userId: string, values: z.infer<typeof updateSchema>) {
    try {
        const validatedValues = updateSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }

        const res = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data.msg || 'Update failed.' };
        }

        return { success: true, user: data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred. Please ensure the backend is running.' };
    }
}

const addressSchema = z.object({
    houseNo: z.string().min(1, "House/Flat No. is required"),
    landmark: z.string().min(1, "Nearest Landmark is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    country: z.string().min(1, "Country is required"),
});

function formatAddress(values: z.infer<typeof addressSchema>): string {
    return `${values.houseNo}, ${values.landmark}, ${values.city}, ${values.state} - ${values.pincode}, ${values.country}`;
}

export async function addAddress(userId: string, values: z.infer<typeof addressSchema>) {
    try {
        const validatedValues = addressSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }
        
        const fullAddress = formatAddress(validatedValues.data);

        const res = await fetch(`${API_URL}/api/users/${userId}/addresses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullAddress }),
            cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to add address.' };
        }
        return { success: true, user: data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function updateAddress(userId: string, addressId: string, values: z.infer<typeof addressSchema>) {
    try {
        const validatedValues = addressSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }
        
        const fullAddress = formatAddress(validatedValues.data);

        const res = await fetch(`${API_URL}/api/users/${userId}/addresses/${addressId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullAddress }),
            cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to update address.' };
        }
        return { success: true, user: data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function deleteAddress(userId: string, addressId: string) {
    try {
        const res = await fetch(`${API_URL}/api/users/${userId}/addresses/${addressId}`, {
            method: 'DELETE',
            cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.msg || 'Failed to delete address.' };
        }
        return { success: true, user: data };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function deleteUser(userId: string) {
    try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
            method: 'DELETE',
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { success: false, message: errorData.msg || 'Failed to delete account.' };
        }

        return { success: true, message: 'Account deleted successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


export async function sendPasswordResetOtp(email: string) {
  try {
    const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.errors[0]?.msg || 'Failed to send OTP.' };
    }
    return { success: true, message: 'OTP sent to your email.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function verifyPasswordResetOtp(email: string, otp: string) {
  try {
    const res = await fetch(`${API_URL}/api/auth/verify-password-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
      cache: 'no-store',
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.errors[0]?.msg || 'OTP verification failed.' };
    }
    return { success: true, message: 'OTP verified.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

const resetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function resetPassword(values: z.infer<typeof resetPasswordSchema>) {
    try {
        const validatedValues = resetPasswordSchema.safeParse(values);
        if (!validatedValues.success) {
            return { success: false, message: 'Invalid input.' };
        }
        const res = await fetch(`${API_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validatedValues.data),
            cache: 'no-store',
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { success: false, message: errorData.errors[0]?.msg || 'Failed to reset password.' };
        }

        return { success: true, message: 'Password has been reset successfully.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}


// New action for checkout
const silentRegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function loginOrRegisterDuringCheckout(values: z.infer<typeof silentRegisterSchema>) {
    // 1. Try to log in first
    const loginResult = await loginUser({ email: values.email, password: values.password });
    if (loginResult.success) {
        return loginResult;
    }

    // 2. If login fails (likely because user doesn't exist), try to register
    if (loginResult.message?.includes('not signed up')) {
        const res = await fetch(`${API_URL}/api/auth/silent-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
            cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.errors[0]?.msg || 'Could not create account.' };
        }
        // Return the newly created user object
        return { success: true, user: data };
    }

    // 3. If login fails for another reason (e.g., wrong password), return that error
    return loginResult;
}