import { agenda } from '../agenda.js';
import { sendCapsuleUnlockEmail } from '../../services/email.service.js';
import { Capsule } from '../../modules/capsules/capsule.model.js';
import { User } from '../../modules/users/user.model.js';

export const CAPSULE_UNLOCK_JOB = 'capsule:unlock';

// server/src/jobs/definitions/capsuleUnlock.job.js


agenda.define(CAPSULE_UNLOCK_JOB, async (job) => {
    const { capsuleId } = job.attrs.data;

    const capsule = await Capsule.findById(capsuleId);
    if (!capsule) {
        console.log(`Capsule ${capsuleId} not found — removing job.`);
        // Only cancel on explicit not-found, not on errors
        await agenda.cancel({ name: CAPSULE_UNLOCK_JOB, 'data.capsuleId': capsuleId });
        return;
    }

    const user = await User.findById(capsule.user);
    if (!user) {
        console.log(`User for capsule ${capsuleId} not found — removing job.`);
        await agenda.cancel({ name: CAPSULE_UNLOCK_JOB, 'data.capsuleId': capsuleId });
        return;
    }

    // 1. Unlock
    await Capsule.findByIdAndUpdate(capsuleId, { $set: { isUnlocked: true } });
    console.log(`🔓 Capsule ${capsuleId} unlocked at ${new Date().toISOString()}`);

    // 2. Send email
    await sendCapsuleUnlockEmail({
        to: user.email,
        username: user.username,
        capsuleTitle: capsule.title,
        capsuleContent: capsule.content,
        capsuleId: capsule._id,
    });
    console.log(`📬 Email sent to ${user.email}`);

    // 3. Self-remove ONLY after both succeed
    await agenda.cancel({ name: CAPSULE_UNLOCK_JOB, 'data.capsuleId': capsuleId });
    console.log(`🗑  Job removed for capsule ${capsuleId}`);
    // If an error is thrown above, the job stays in MongoDB and Agenda retries it
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