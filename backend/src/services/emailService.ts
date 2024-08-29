import NodeCache from "node-cache";
import nodemailer from "nodemailer";

const EMAIL_QUEUE_KEY = "email_queue";

// Cache for storing email queue
const emailQueueCache = new NodeCache({
  stdTTL: 0, // No automatic expiration
  useClones: false,
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-password",
  },
});

interface EmailJob {
  email: string;
  subject: string;
  body: string;
}

export const addToEmailQueue = (job: EmailJob): void => {
  const queue = emailQueueCache.get<EmailJob[]>(EMAIL_QUEUE_KEY) || [];
  queue.push(job);
  emailQueueCache.set(EMAIL_QUEUE_KEY, queue);
};

const processEmailQueue = async (): Promise<void> => {
  const queue = emailQueueCache.get<EmailJob[]>(EMAIL_QUEUE_KEY) || [];
  if (queue.length > 0) {
    const job = queue.shift();
    emailQueueCache.set(EMAIL_QUEUE_KEY, queue);

    if (job) {
      try {
        // await transporter.sendMail({
        //   from: "your-email@gmail.com",
        //   to: job.email,
        //   subject: job.subject,
        //   text: job.body,
        // });
        console.log(`Sending email to ${job.email}: ${job.subject}`);
      } catch (error) {
        console.error("Failed to send email:", error);
        addToEmailQueue(job);
      }
    }
  }

  setTimeout(processEmailQueue, 1000);
};

// Start email processing
const startEmailService = (): void => {
  processEmailQueue();
  console.log("Email service started");
};

export default startEmailService;
