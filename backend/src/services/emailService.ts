import NodeCache from "node-cache";

const EMAIL_QUEUE_KEY = "email_queue";

const cache = new NodeCache({
  stdTTL: 600, // 10 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone objects on get/set
  deleteOnExpire: true, // Delete expired items
  maxKeys: -1, // No limit on number of keys
});

interface EmailJob {
  email: string;
  subject: string;
  body: string;
}

export const addToEmailQueue = (job: EmailJob): void => {
  const queue = cache.get<EmailJob[]>(EMAIL_QUEUE_KEY) || [];
  queue.push(job);
  cache.set(EMAIL_QUEUE_KEY, queue);
};

const processEmailQueue = async (): Promise<void> => {
  const queue = cache.get<EmailJob[]>(EMAIL_QUEUE_KEY) || [];
  if (queue.length > 0) {
    const job = queue.shift();
    cache.set(EMAIL_QUEUE_KEY, queue);

    if (job) {
      try {
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
