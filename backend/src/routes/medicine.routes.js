import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { Medicine } from '../models/Medicine.js';
import { resolveMedicineStatus } from '../utils/medicine.js';
import { isValidObjectId, toPublicDocument } from '../utils/mongoose.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });

    // Auto-update statuses for medicines whose expiry/stock may have changed
    const bulkOps = medicines
      .map(med => {
        const correctStatus = resolveMedicineStatus({
          stock: med.stock,
          expiryDate: med.expiryDate,
          status: med.status,
        });
        if (correctStatus !== med.status) {
          return {
            updateOne: {
              filter: { _id: med._id },
              update: { $set: { status: correctStatus } },
            },
          };
        }
        return null;
      })
      .filter(Boolean);

    if (bulkOps.length > 0) {
      await Medicine.bulkWrite(bulkOps);
      // Re-fetch updated medicines
      const updated = await Medicine.find().sort({ createdAt: -1 });
      return res.json({
        success: true,
        count: updated.length,
        data: updated.map(toPublicDocument),
      });
    }

    res.json({
      success: true,
      count: medicines.length,
      data: medicines.map(toPublicDocument),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid medicine identifier',
      });
    }

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.json({
      success: true,
      data: toPublicDocument(medicine),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, requireRole('admin', 'pharmacist'), async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      status: resolveMedicineStatus(req.body),
    };

    const medicine = await Medicine.create(payload);

    res.status(201).json({
      success: true,
      message: 'Medicine created successfully',
      data: toPublicDocument(medicine),
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', requireAuth, requireRole('admin', 'pharmacist'), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid medicine identifier',
      });
    }

    const existingMedicine = await Medicine.findById(req.params.id);

    if (!existingMedicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    const payload = {
      ...req.body,
      status: resolveMedicineStatus({
        stock: req.body.stock ?? existingMedicine.stock,
        expiryDate: req.body.expiryDate ?? existingMedicine.expiryDate,
        status: req.body.status ?? existingMedicine.status,
      }),
    };

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      data: toPublicDocument(medicine),
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
        message: 'Invalid medicine identifier',
      });
    }

    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.json({
      success: true,
      message: 'Medicine deleted successfully',
      data: toPublicDocument(medicine),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
