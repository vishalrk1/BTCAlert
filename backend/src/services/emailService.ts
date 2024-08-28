import Redis from "ioredis";
import nodemailer from "nodemailer";

const redis = new Redis({
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

const EMAIL_QUEUE_KEY = "email_queue";

interface EmailJob {
  email: string;
  subject: string;
  body: string;
}

const transporter = nodemailer.createTransport({});

const processEmailQueue = async (): Promise<void> => {
  try {
    // Get the oldest job from the queue
    const result = await redis.zpopmin(EMAIL_QUEUE_KEY);

    if (result.length > 0) {
      const [jobJson] = result;
      const job: EmailJob = JSON.parse(jobJson);

      try {
        await transporter.sendMail({
          from: "your-email@example.com",
          to: job.email,
          subject: job.subject,
          text: job.body,
        });
        console.log(`Email sent to ${job.email}`);
      } catch (error) {
        console.error("Failed to send email:", error);
        await redis.zadd(EMAIL_QUEUE_KEY, Date.now() + 60000, jobJson);
      }
    }
  } catch (error) {
    console.error("Error processing email queue:", error);
  }
  // to process each email after a short delay
  setTimeout(processEmailQueue, 1000);
};

const startEmailService = (): void => {
  processEmailQueue();
  console.log("Email service started");
};

export default startEmailService;
