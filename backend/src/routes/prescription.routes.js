import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Prescription } from '../models/Prescription.js';
import { isValidObjectId, toPublicDocument } from '../utils/mongoose.js';
import { persistPrescriptionUpload } from '../utils/uploads.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.patientEmail) {
      filter.patientEmail = String(req.query.patientEmail).toLowerCase();
    }

    if (req.auth.role === 'customer') {
      filter.patientEmail = req.auth.user.email;
    }

    const prescriptions = await Prescription.find(filter)
      .populate('reviewedBy')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions.map(toPublicDocument),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prescription identifier',
      });
    }

    const prescription = await Prescription.findById(req.params.id).populate('reviewedBy');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    if (req.auth.role === 'customer' && prescription.patientEmail !== req.auth.user.email) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this prescription',
      });
    }

    res.json({
      success: true,
      data: toPublicDocument(prescription),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    if (!req.body.doctorName) {
      return res.status(400).json({
        success: false,
        message: 'Doctor name is required',
      });
    }

    let uploadFields = {};

    if (req.body.fileContent) {
      uploadFields = await persistPrescriptionUpload({
        fileName: req.body.fileName,
        fileContent: req.body.fileContent,
        fileType: req.body.fileType,
      });
    }

    const prescription = await Prescription.create({
      ...req.body,
      patientEmail: req.body.patientEmail || req.auth.user.email,
      patientName: req.body.patientName || req.auth.user.name,
      ...uploadFields,
    });

    res.status(201).json({
      success: true,
      message: 'Prescription submitted successfully',
      data: toPublicDocument(prescription),
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/review', requireAuth, requireRole('admin', 'pharmacist'), async (req, res, next) => {
  try {
    const { status, rejectionReason, pharmacistNotes, reviewedBy } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prescription identifier',
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Review status must be approved or rejected',
      });
    }

    if (status === 'rejected' && !String(rejectionReason || '').trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a prescription',
      });
    }

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : '',
        pharmacistNotes,
        reviewedBy,
        reviewedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    res.json({
      success: true,
      message: `Prescription ${status} successfully`,
      data: toPublicDocument(prescription),
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid prescription identifier',
      });
    }

    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    res.json({
      success: true,
      message: 'Prescription deleted successfully',
      data: toPublicDocument(prescription),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
