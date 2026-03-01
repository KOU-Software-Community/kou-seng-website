import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        status: { type: String, enum: ['sent', 'failed'], required: true },
        error: { type: String },
    },
    { _id: false },
);

const attachmentSchema = new mongoose.Schema(
    {
        filename: { type: String, required: true },
        contentType: { type: String, required: true },
        data: { type: Buffer, required: true },
    },
    { _id: false },
);

const mailJobSchema = new mongoose.Schema(
    {
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subject: { type: String, required: true },
        recipients: [{ type: String }],
        currentIndex: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['pending', 'running', 'done', 'cancelled'],
            default: 'pending',
        },
        results: [resultSchema],
        attachments: [attachmentSchema],
        blocks: { type: mongoose.Schema.Types.Mixed, required: true },
        scheduledAt: { type: Date, default: null },
        nextSendAt: { type: Date },
    },
    { timestamps: true },
);

const MailJob = mongoose.model('MailJob', mailJobSchema);

export default MailJob;
