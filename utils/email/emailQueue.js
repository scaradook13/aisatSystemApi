const { Queue, Worker } = require("bullmq");
const sendEmail = require("./sendEmail"); // ✅ Adjust relative path properly

// 📨 Create the queue
const emailQueue = new Queue("emailQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

// ⚙️ Worker that processes queued email jobs
const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { email, subject, templatePath, templateData } = job.data;
    await sendEmail(email, subject, templatePath, templateData); // ✅ Correct parameter order
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

// Optional: log when job completes or fails (for debugging)
emailWorker.on("completed", (job) => {
  console.log(`✅ Email sent successfully to ${job.data.email}`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`❌ Failed to send email to ${job.data.email}:`, err);
});

module.exports = emailQueue;
