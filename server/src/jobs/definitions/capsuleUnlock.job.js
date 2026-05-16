import { agenda } from '../agenda.js';
import { sendCapsuleUnlockEmail } from '../../services/email.service.js';
import { Capsule } from '../../modules/capsules/capsule.model.js';
import { User } from '../../modules/users/user.model.js';

export const CAPSULE_UNLOCK_JOB = 'capsule:unlock';

agenda.define(CAPSULE_UNLOCK_JOB, async (job) => {
    const { capsuleId } = job.attrs.data;

    try {
        const capsule = await Capsule.findById(capsuleId);
        if (!capsule) {
            console.log(`Capsule ${capsuleId} not found — skipping.`);
            return;
        }

        const user = await User.findById(capsule.user);
        if (!user) {
            console.log(`User for capsule ${capsuleId} not found — skipping.`);
            return;
        }

        await Capsule.findByIdAndUpdate(capsuleId, {
            $set: { isUnlocked: true },
        });
        console.log(`🔓 Capsule ${capsuleId} unlocked`);

        await sendCapsuleUnlockEmail({
            to: user.email,
            username: user.username,
            capsuleTitle: capsule.title,
            capsuleContent: capsule.content,
            capsuleId: capsule._id,
        });
        console.log(`📬 Unlock email sent to ${user.email} for capsule ${capsuleId}`);

    } catch (err) {
        console.error(`❌ capsule:unlock job failed for ${capsuleId}:`, err.message);
        throw err;

    } finally {
        await agenda.cancel({
            name: CAPSULE_UNLOCK_JOB,
            'data.capsuleId': capsuleId,
        });
        console.log(`🗑  Job removed for capsule ${capsuleId}`);
    }
});

// ── Schedule at exact UTC unlock time ─────────────────────────────────────────
export const scheduleCapsuleUnlock = async (capsule) => {
    await agenda.schedule(
        capsule.unlockAt,
        CAPSULE_UNLOCK_JOB,
        { capsuleId: capsule._id.toString() }
    );
    console.log(`🗓  Unlock job scheduled: capsule ${capsule._id} at ${capsule.unlockAt.toISOString()}`);
};

// ── Cancel on capsule delete ──────────────────────────────────────────────────
export const cancelCapsuleUnlock = async (capsuleId) => {
    const removed = await agenda.cancel({
        name: CAPSULE_UNLOCK_JOB,
        'data.capsuleId': capsuleId.toString(),
    });
    console.log(`🗑  Cancelled ${removed} unlock job(s) for capsule ${capsuleId}`);
};