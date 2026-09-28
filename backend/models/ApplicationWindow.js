import mongoose from 'mongoose';
import { APPLICATION_SLUGS } from '../helpers/applicationWindow.js';

// Başvuru formu başına bir kayıt; kayıt yoksa helpers/applicationWindow.js'teki varsayılan geçerli.
const applicationWindowSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true, enum: APPLICATION_SLUGS },
    opensAt: { type: Date, default: null },
    closesAt: { type: Date, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
},
    { timestamps: true }
);

export default mongoose.model('ApplicationWindow', applicationWindowSchema);
