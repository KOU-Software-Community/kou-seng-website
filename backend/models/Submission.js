import mongoose from "mongoose";

// Tüm başvurular için ortak şema
const submissionSchema = new mongoose.Schema(
  {
    submissionType: {
      type: String,
      enum: ["general", "technical"],
      required: true,
    },
    // Genel başvuru bilgileri
    name: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    faculty: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 6, // Hazırlık sınıfı veya yüksek lisans/doktora dahil
    },
    // Teknik başvuru için ek alanlar
    technicalCategory: {
      type: String,
      trim: true,
      // Eğer submissionType technical ise gerekli
      required: function() {
        return this.submissionType === "technical";
      }
    },
    // Dinamik alanlar için esnek yapı
    // Her teknik kategori için farklı alanlar tutabilir
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    // İşleme durumu
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending"
    },
    reviewNotes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// İndeksler oluşturuyoruz
submissionSchema.index({ submissionType: 1 });
submissionSchema.index({ technicalCategory: 1 });
submissionSchema.index({ email: 1 });
submissionSchema.index({ studentId: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ createdAt: -1 });

export default mongoose.model("Submission", submissionSchema);
