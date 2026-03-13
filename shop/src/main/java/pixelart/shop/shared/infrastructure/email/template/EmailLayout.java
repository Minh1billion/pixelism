package pixelart.shop.shared.infrastructure.email.template;

public class EmailLayout {

    private static final String BRAND_COLOR     = "#4ade80"; // green-400
    private static final String BRAND_COLOR_DARK = "#166534"; // green-900
    private static final String BG_COLOR        = "#0a0a0a";
    private static final String CARD_COLOR      = "#171717";
    private static final String BORDER_COLOR    = "#262626";
    private static final String TEXT_PRIMARY    = "#ffffff";
    private static final String TEXT_SECONDARY  = "#a3a3a3";
    private static final String TEXT_MUTED      = "#525252";

    public static String wrap(String title, String bodyHtml) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <title>%s</title>
                </head>
                <body style="margin:0;padding:0;background-color:%s;font-family:'Segoe UI',Arial,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:%s;padding:40px 16px;">
                    <tr>
                      <td align="center">
                        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%%;">

                          <!-- Header / Logo -->
                          <tr>
                            <td align="center" style="padding-bottom:28px;">
                              <table cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="background-color:%s;border:1px solid %s;border-radius:10px;padding:8px 20px;">
                                    <span style="font-size:18px;font-weight:900;color:%s;letter-spacing:-0.5px;">PIXELISM</span>
                                    <span style="font-size:9px;color:%s;letter-spacing:3px;display:block;text-align:center;margin-top:2px;">⚔ REALM OF PIXELS ⚔</span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          <!-- Card -->
                          <tr>
                            <td style="background-color:%s;border:1px solid %s;border-radius:16px;overflow:hidden;">

                              <!-- Top accent line -->
                              <div style="height:2px;background:linear-gradient(90deg,transparent,%s,transparent);"></div>

                              <!-- Body content -->
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding:36px 40px;">
                                    %s
                                  </td>
                                </tr>
                              </table>

                              <!-- Bottom accent line -->
                              <div style="height:1px;background:%s;margin:0 40px;"></div>

                              <!-- Footer -->
                              <table width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="padding:20px 40px;text-align:center;">
                                    <p style="margin:0;font-size:11px;color:%s;letter-spacing:1px;">
                                      Pixelism &nbsp;·&nbsp; Realm of Pixels &nbsp;·&nbsp; Do not reply to this email
                                    </p>
                                    <p style="margin:8px 0 0;font-size:10px;color:%s;letter-spacing:2px;">
                                      ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ
                                    </p>
                                  </td>
                                </tr>
                              </table>

                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(
                title,
                BG_COLOR, BG_COLOR,
                CARD_COLOR, BORDER_COLOR, TEXT_PRIMARY, BRAND_COLOR,
                CARD_COLOR, BORDER_COLOR,
                BRAND_COLOR,
                bodyHtml,
                BORDER_COLOR,
                TEXT_MUTED, TEXT_MUTED
        );
    }

    public static String h1(String text) {
        return "<h1 style=\"margin:0 0 8px;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;\">" + text + "</h1>";
    }

    public static String subtitle(String text) {
        return "<p style=\"margin:0 0 28px;font-size:12px;color:" + BRAND_COLOR + ";letter-spacing:3px;text-transform:uppercase;\">" + text + "</p>";
    }

    public static String p(String text) {
        return "<p style=\"margin:0 0 16px;font-size:14px;color:" + TEXT_SECONDARY + ";line-height:1.7;\">" + text + "</p>";
    }

    public static String otpBox(String otp) {
        return """
               <table width="100%%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                 <tr>
                   <td align="center">
                     <div style="background-color:#0d2818;border:1px solid %s;border-radius:12px;padding:20px 40px;display:inline-block;">
                       <p style="margin:0 0 4px;font-size:10px;color:%s;letter-spacing:3px;text-transform:uppercase;">Your Arcane Cipher</p>
                       <p style="margin:0;font-size:36px;font-weight:900;color:%s;letter-spacing:12px;font-family:monospace;">%s</p>
                       <p style="margin:6px 0 0;font-size:10px;color:%s;">Valid for 5 minutes</p>
                     </div>
                   </td>
                 </tr>
               </table>
               """.formatted(BRAND_COLOR, BRAND_COLOR, TEXT_PRIMARY, otp, TEXT_MUTED);
    }

    public static String divider() {
        return "<div style=\"height:1px;background:" + BORDER_COLOR + ";margin:24px 0;\"></div>";
    }

    public static String badge(String emoji, String text) {
        return """
               <tr>
                 <td style="padding:6px 0;">
                   <table cellpadding="0" cellspacing="0">
                     <tr>
                       <td style="width:28px;font-size:14px;">%s</td>
                       <td style="font-size:13px;color:#d4d4d4;padding-left:4px;">%s</td>
                     </tr>
                   </table>
                 </td>
               </tr>
               """.formatted(emoji, text);
    }

    public static String warningBox(String text) {
        return """
               <table width="100%%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                 <tr>
                   <td style="background-color:#1c0a00;border:1px solid #92400e;border-radius:10px;padding:14px 18px;">
                     <p style="margin:0;font-size:12px;color:#fbbf24;line-height:1.6;">⚠️ &nbsp;%s</p>
                   </td>
                 </tr>
               </table>
               """.formatted(text);
    }

    public static String infoRow(String label, String value) {
        return """
               <tr>
                 <td style="padding:8px 0;border-bottom:1px solid #262626;">
                   <table width="100%%" cellpadding="0" cellspacing="0">
                     <tr>
                       <td style="font-size:11px;color:#525252;text-transform:uppercase;letter-spacing:1px;width:120px;">%s</td>
                       <td style="font-size:13px;color:#e5e5e5;font-weight:600;">%s</td>
                     </tr>
                   </table>
                 </td>
               </tr>
               """.formatted(label, value);
    }
}