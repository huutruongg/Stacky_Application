export const resetPasswordTemplate = (userName: string, resetUrl: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .header img {
            width: 120px;
        }
        .content {
            line-height: 1.6;
        }
        .content h2 {
            color: #007bff;
            font-size: 24px;
        }
        .button {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px 15px;
            text-align: center;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://firebasestorage.googleapis.com/v0/b/stackydemo-95381.appspot.com/o/The_Stacky_Team.jpg?alt=media&token=906375fb-45a4-48ed-846d-bd8b680a5ffa" alt="Company Logo">
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>Dear ${userName},</p>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Thank you,</p>
            <p>The Stacky Team</p>
        </div>
        <div class="footer">
            <p>If you have any questions, contact our support team at <a href="mailto:support@yourdomain.com">Stacky Team</a></p>
        </div>
    </div>
</body>
</html>
`;
