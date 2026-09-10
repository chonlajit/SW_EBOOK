import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const emailFrom = process.env.EMAIL_FROM || 'E-book Shop <onboarding@resend.dev>';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendEmailParams {
  to: string;
  customerName: string;
  orderId: string;
  bookTitle: string;
  amount: number;
  downloadUrl: string;
}

export async function sendOrderConfirmationEmail(params: SendEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}> {
  const { to, customerName, orderId, bookTitle, amount, downloadUrl } = params;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155; }
          .header { text-align: center; border-bottom: 1px solid #334155; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #38bdf8; margin: 0; }
          .badge { display: inline-block; background: #059669; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-top: 8px; }
          .content { margin: 24px 0; font-size: 15px; line-height: 1.6; color: #cbd5e1; }
          .details { background: #0f172a; padding: 16px; border-radius: 8px; margin: 20px 0; }
          .details-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .btn-container { text-align: center; margin: 32px 0; }
          .btn { background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4); }
          .note { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }
          .demo-tag { color: #f59e0b; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">📚 Vibe E-Book Store</h1>
            <span class="badge">ชำระเงินสำเร็จ (DEMO)</span>
          </div>
          <div class="content">
            <p>เรียน คุณ <strong>${customerName}</strong>,</p>
            <p>ขอบคุณที่สั่งซื้อหนังสือ E-book จากระบบสาธิตของเรา รายการสั่งซื้อของท่านได้รับการยืนยันเรียบร้อยแล้ว</p>
            
            <div class="details">
              <div><strong>รหัสคำสั่งซื้อ:</strong> ${orderId}</div>
              <div><strong>หนังสือ:</strong> ${bookTitle}</div>
              <div><strong>ยอดชำระ:</strong> ฿${amount.toFixed(2)}</div>
              <div><strong>สถานะ:</strong> ชำระเงินเรียบร้อย (PAID)</div>
            </div>

            <p>ท่านสามารถคลิกปุ่มด้านล่างเพื่อดาวน์โหลดไฟล์ E-book (ลิงก์นี้ปลอดภัยและมีอายุ 2 ชั่วโมง):</p>
            <div class="btn-container">
              <a href="${downloadUrl}" class="btn" target="_blank">📥 ดาวน์โหลด E-book ของคุณ</a>
            </div>
            <p style="text-align: center; font-size: 13px; color: #94a3b8;">
              หากกดปุ่มไม่ได้ สามารถคัดลอกลิงก์นี้เปิดในเบราว์เซอร์:<br/>
              <span style="word-break: break-all; color: #38bdf8;">${downloadUrl}</span>
            </p>
          </div>
          <div class="note">
            <p><span class="demo-tag">[DEMO ONLY]</span> อีเมลนี้สร้างจากระบบจำลองการสั่งซื้อเพื่อการศึกษาเท่านั้น</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (resend) {
    try {
      const response = await resend.emails.send({
        from: emailFrom,
        to,
        subject: `[Vibe E-Book] ยืนยันคำสั่งซื้อ #${orderId} และลิงก์ดาวน์โหลด`,
        html: htmlContent,
      });

      if (response.error) {
        console.warn('Resend API returned an error:', response.error);
        return {
          success: false,
          error: response.error.message,
          simulated: true, // Mark fallback
        };
      }

      return {
        success: true,
        messageId: response.data?.id,
        simulated: false,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Failed to send email via Resend:', errorMsg);
      return {
        success: false,
        error: errorMsg,
        simulated: true,
      };
    }
  }

  // Fallback simulation when no Resend API key is configured
  console.log(`[SIMULATED EMAIL] To: ${to} | Subject: Order #${orderId} Paid | DownloadUrl: ${downloadUrl}`);
  return {
    success: true,
    messageId: `sim-${Date.now()}`,
    simulated: true,
  };
}
