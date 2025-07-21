const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const { Resend } = require('resend');

const User = require('../../models/User');
const Verification = require('../../models/Verification');
const PasswordReset = require('../../models/PasswordReset');


const resend = new Resend(process.env.RESEND_API_KEY);
const OTP_VALIDITY_MINUTES = 5;

// @route   POST api/auth/register
// @desc    Handle user registration details, send OTP
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ errors: [{ msg: 'Please enter all fields' }] });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    
    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password);
    const hashedOtp = await bcrypt.hash(otp);

    await Verification.findOneAndUpdate(
      { email },
    {$set:{ firstName, lastName, password: hashedPassword, otp: hashedOtp },},
      { upsert: true, new: true }
    );

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Your Verification Code for PRAMILA`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #350210;">Welcome to PRAMILA!</h2>
            <p>Thank you for registering. Please use the following One-Time Password (OTP) to complete your signup process.</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; text-align: center; color: #350210;">${otp}</p>
            <p>This code is valid for <strong>${OTP_VALIDITY_MINUTES} minutes</strong>. For your security, please do not share this code with anyone.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
            <br>
            <p>Best regards,<br>The PRAMILA Team</p>
        </div>
      `,
    });

    res.status(200).json({ msg: 'OTP sent successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/verify-otp
// @desc    Verify OTP and create user
// @access  Public
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ errors: [{ msg: 'Email and OTP are required' }] });
    }

    try {
        const verificationDoc = await Verification.findOne({ email });
        if (!verificationDoc) {
            return res.status(400).json({ errors: [{ msg: 'Invalid OTP or session expired. Please try again.' }] });
        }
        
        const timeDiff = (new Date() - verificationDoc.createdAt) / (1000 * 60);
        if (timeDiff > OTP_VALIDITY_MINUTES) {
            await Verification.deleteOne({ email });
            return res.status(400).json({ errors: [{ msg: 'OTP has expired. Please request a new one.' }] });
        }

        const isMatch = await bcrypt.compare(otp, verificationDoc.otp);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid OTP. Please try again.' }] });
        }

        const newUser = new User({
            firstName: verificationDoc.firstName,
            lastName: verificationDoc.lastName,
            email: verificationDoc.email,
            password: verificationDoc.password,
        });

        await newUser.save();
        await Verification.deleteOne({ email });

        res.status(201).json({ msg: 'User registered successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/resend-otp
// @desc    Resend OTP for verification
// @access  Public
router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ errors: [{ msg: 'Email is required' }] });
    }

    try {
        const verificationDoc = await Verification.findOne({ email });
        if (!verificationDoc) {
            return res.status(400).json({ errors: [{ msg: 'No pending verification found for this email.' }] });
        }
        
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        verificationDoc.otp = hashedOtp;
        verificationDoc.createdAt = new Date();
        await verificationDoc.save();

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `Your New Verification Code for PRAMILA`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h2 style="color: #350210;">Your New PRAMILA Verification Code</h2>
                    <p>A new One-Time Password (OTP) has been generated for you.</p>
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; text-align: center; color: #350210;">${otp}</p>
                    <p>This code is valid for <strong>${OTP_VALIDITY_MINUTES} minutes</strong>. Please do not share this code with anyone.</p>
                    <br>
                    <p>Best regards,<br>The PRAMILA Team</p>
                </div>
            `,
        });

        res.status(200).json({ msg: 'New OTP sent successfully' });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST api/auth/login
// @desc    Authenticate user
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ errors: [{ msg: 'Please enter all fields' }] });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'You are not signed up, please sign up first' }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json(userResponse);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST api/auth/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ errors: [{ msg: 'Email is required' }] });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User with this email does not exist.' }] });
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        await PasswordReset.findOneAndUpdate(
            { email },
            { otp: hashedOtp, createdAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Your Password Reset Code for PRAMILA',
            html: `
               <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h2 style="color: #350210;">Password Reset Request</h2>
                    <p>We received a request to reset your password. Use the following One-Time Password (OTP) to proceed.</p>
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0; text-align: center; color: #350210;">${otp}</p>
                    <p>This code is valid for <strong>${OTP_VALIDITY_MINUTES} minutes</strong>. If you did not request a password reset, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>The PRAMILA Team</p>
                </div>
            `,
        });

        res.status(200).json({ msg: 'Password reset OTP sent successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/auth/verify-password-otp
// @desc    Verify OTP for password reset
// @access  Public
router.post('/verify-password-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ errors: [{ msg: 'Email and OTP are required' }] });
    }

    try {
        const resetDoc = await PasswordReset.findOne({ email });
        if (!resetDoc) {
            return res.status(400).json({ errors: [{ msg: 'Invalid OTP or session expired. Please try again.' }] });
        }

        const timeDiff = (new Date() - resetDoc.createdAt) / (1000 * 60);
        if (timeDiff > OTP_VALIDITY_MINUTES) {
            await PasswordReset.deleteOne({ email });
            return res.status(400).json({ errors: [{ msg: 'OTP has expired. Please request a new one.' }] });
        }

        const isMatch = await bcrypt.compare(otp, resetDoc.otp);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid OTP. Please try again.' }] });
        }

        // OTP is valid, but don't delete the doc yet. The final reset step will do that.
        res.status(200).json({ msg: 'OTP verified successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/auth/reset-password
// @desc    Reset user password after OTP verification
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
        return res.status(400).json({ errors: [{ msg: 'All fields are required' }] });
    }

    try {
        const resetDoc = await PasswordReset.findOne({ email });
        if (!resetDoc) {
            return res.status(400).json({ errors: [{ msg: 'Invalid session. Please start the password reset process again.' }] });
        }

        const timeDiff = (new Date() - resetDoc.createdAt) / (1000 * 60);
        if (timeDiff > OTP_VALIDITY_MINUTES) {
             await PasswordReset.deleteOne({ email });
            return res.status(400).json({ errors: [{ msg: 'Your session has expired. Please request a new password reset.' }] });
        }

        const isOtpMatch = await bcrypt.compare(otp, resetDoc.otp);
        if (!isOtpMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid OTP. Please try again.' }] });
        }

        const user = await User.findOne({ email });
        if (!user) {
             await PasswordReset.deleteOne({ email });
            return res.status(404).json({ errors: [{ msg: 'User not found.' }] });
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        await PasswordReset.deleteOne({ email });

        res.status(200).json({ msg: 'Password has been reset successfully.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
   }
});

// @route   POST api/auth/silent-register
// @desc    Register user without OTP (during checkout)
// @access  Public
router.post('/silent-register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ errors: [{ msg: 'Please enter all fields' }] });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    user = new User({ firstName, lastName, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
