import {
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocFromCache,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import type { DailyVehicleCalculation, DailyVehicleEntry } from "./dailyEntry";

export const DAILY_ENTRIES_COLLECTION = "dailyVehicleEntries";

export const dailyEntryId = (vehicleId: string, drivingDate: string) =>
  `${vehicleId}_${drivingDate}`;

const entryData = (
  calculation: DailyVehicleCalculation,
  createdAt?: Timestamp | null
) => ({
  drivingDate: calculation.drivingDate,
  monthKey: calculation.drivingDate.slice(0, 7),
  vehicleId: calculation.vehicle.id,
  vehicleName: calculation.vehicle.name,
  consumptionRate: calculation.vehicle.consumption,
  quantities: calculation.quantities,
  fuel: calculation.fuel,
  createdAt: createdAt instanceof Timestamp ? createdAt : serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export type SaveEntryResult = {
  existed: boolean;
  start: (
    onPendingChange: (isPending: boolean) => void,
    onError: () => void,
    confirmConcurrentReplacement: () => boolean
  ) => () => void;
};

class ConcurrentEntryError extends Error {}

export const prepareDailyEntrySave = async (
  db: Firestore,
  calculation: DailyVehicleCalculation,
  originalEntry?: DailyVehicleEntry
): Promise<SaveEntryResult> => {
  const reference = doc(
    db,
    DAILY_ENTRIES_COLLECTION,
    dailyEntryId(calculation.vehicle.id, calculation.drivingDate)
  );
  const originalReference = originalEntry
    ? doc(db, DAILY_ENTRIES_COLLECTION, originalEntry.id)
    : reference;
  const identityChanged = originalReference.path !== reference.path;

  let existing: DocumentSnapshot<DocumentData> | undefined;
  let useQueuedWrite = !navigator.onLine;
  try {
    existing = useQueuedWrite
      ? await getDocFromCache(reference)
      : await getDoc(reference);
  } catch {
    useQueuedWrite = true;
    try {
      existing = await getDocFromCache(reference);
    } catch {
      existing = undefined;
    }
  }

  return {
    // When the server cannot be checked, warn conservatively before a queued
    // write that might replace a document this device has never cached.
    existed: Boolean(existing?.exists() || useQueuedWrite),
    start: (onPendingChange, onError, confirmConcurrentReplacement) => {
      if (!useQueuedWrite) {
        let cancelled = false;
        const saveInTransaction = (replacementConfirmed: boolean): Promise<void> =>
          runTransaction(db, async (transaction) => {
            const current = await transaction.get(reference);
            const original = identityChanged
              ? await transaction.get(originalReference)
              : current;
            if (current.exists() && !existing?.exists() && !replacementConfirmed) {
              throw new ConcurrentEntryError();
            }
            const creationTime = identityChanged
              ? original.data()?.createdAt ?? originalEntry?.createdAt
              : current.data()?.createdAt;
            transaction.set(reference, entryData(calculation, creationTime));
            if (identityChanged) transaction.delete(originalReference);
          }).then(() => undefined);

        saveInTransaction(false).catch((error) => {
          if (error instanceof ConcurrentEntryError && confirmConcurrentReplacement()) {
            return saveInTransaction(true);
          }
          throw error;
        }).then(
          () => { if (!cancelled) onPendingChange(false); },
          () => { if (!cancelled) onError(); }
        );
        return () => { cancelled = true; };
      }

      const batch = writeBatch(db);
      batch.set(
        reference,
        entryData(
          calculation,
          identityChanged ? originalEntry?.createdAt : existing?.data()?.createdAt
        )
      );
      if (identityChanged) batch.delete(originalReference);
      batch.commit().catch(onError);
      const unsubscribe = onSnapshot(
        reference,
        { includeMetadataChanges: true },
        (snapshot) => {
          if (!snapshot.exists()) return;
          const isPending = snapshot.metadata.hasPendingWrites;
          onPendingChange(isPending);
          if (!isPending) {
            unsubscribe();
          }
        },
        onError
      );
      return unsubscribe;
    },
  };
};
