import mongoose from 'mongoose';

// Game jam takım başvurusu. Doğrulama helpers/jamInput.js'te; şema yalnızca saklar.
const personFields = {
  name: { type: String, required: true },
  birthDate: { type: String, required: true }, // YYYY-MM-DD
  university: { type: String, required: true },
  department: { type: String, required: true },
  cvUrl: { type: String, required: true },
  projectUrl: { type: String, default: '' },
  disciplines: { type: [String], default: [] },
  otherDiscipline: { type: String, default: '' },
  mediaConsent: { type: Boolean, default: false },
};

const jamApplicationSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },
    leader: new mongoose.Schema(
      { ...personFields, email: { type: String, required: true }, phone: { type: String, required: true } },
      { _id: false }
    ),
    members: [new mongoose.Schema(personFields, { _id: false })],
    answers: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

jamApplicationSchema.index({ createdAt: -1 });

export default mongoose.model('JamApplication', jamApplicationSchema);
