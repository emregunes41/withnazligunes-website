"use server";
import { Resend } from "resend";

export async function sendVerificationEmail(email, name, code) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error("RESEND_API_KEY not found in env");
      return { error: "Mail servisi yapılandırılmamış." };
    }

    console.log("Sending verification email to:", email, "with code:", code);

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "Nazlı Güneş <bilgi@withnazligunes.com>",
      to: [email],
      subject: "Üyeliğini Onayla - With Nazlı Güneş",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #fff; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #c5a572; text-align: center;">Merhaba ${name}!</h1>
          <p style="font-size: 16px; line-height: 1.5; text-align: center;">
            With Nazlı Güneş ailesine hoş geldin! Üyeliğini tamamlamak için aşağıdaki onay kodunu kullanabilirsin:
          </p>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin: 30px 0; text-align: center; border: 2px dashed #c5a572;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #1a1a1a;">${code}</span>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center;">
            Bu kod 30 dakika boyunca geçerlidir. Eğer bu kaydı sen yapmadıysan, lütfen bu maili dikkate alma.
          </p>
          
          <p style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; text-align: center;">
            Sevgiler,<br>
            <strong>Nazlı Güneş</strong><br>
            <a href="https://withnazligunes.com" style="color: #c5a572; text-decoration: none;">withnazligunes.com</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", JSON.stringify(error));
      return { error: error.message };
    }

    console.log("Email sent successfully:", JSON.stringify(data));
    return { success: true };
  } catch (err) {
    console.error("Send mail catch error:", err.message, err.stack);
    return { error: "Mail gönderilirken bir hata oluştu: " + err.message };
  }
}
