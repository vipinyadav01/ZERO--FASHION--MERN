import nodemailer from "nodemailer";

export const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

 
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Zero Fashion Newsletter!",
      text: "Thank you for subscribing to Zero Fashion! You'll now receive the latest updates and offers.",
      html: `
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.07);font-family:'Segoe UI',Arial,sans-serif;padding:32px 24px;">
      <div style="text-align:center;">
        <img src="https://res.cloudinary.com/vipinyadav01/image/upload/v1753460399/pwa-512x512_m656nh.png" alt="Zero Fashion" style="width:64px;height:64px;margin-bottom:16px;border-radius:8px;">
        <h2 style="color:#111;font-size:1.5rem;margin-bottom:8px;">Thank you for subscribing!</h2>
        <p style="color:#444;font-size:1rem;margin-bottom:24px;">
          Welcome to the <b>Zero Fashion</b> community.<br>
          You’ll now receive the latest updates, exclusive offers, and style inspiration directly to your inbox.
        </p>
        <a href="https://zerofashion.vercel.app" style="display:inline-block;padding:12px 28px;background:#111;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;font-size:1rem;margin-bottom:16px;">
          Visit Our Store
        </a>
        <p style="color:#888;font-size:0.95rem;margin-top:24px;">
          If you did not subscribe, please ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;">
        <p style="color:#aaa;font-size:0.85rem;">
          &copy; ${new Date().getFullYear()} Zero Fashion. All rights reserved.
        </p>
      </div>
    </div>
  `
};

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Subscription successful! Confirmation email sent." });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
}; 