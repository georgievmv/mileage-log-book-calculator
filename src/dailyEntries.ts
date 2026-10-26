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
  setDoc,
  Timestamp,
} from "firebase/firestore";
import type { DailyVehicleCalculation } from "./dailyEntry";

export const DAILY_ENTRIES_COLLECTION = "dailyVehicleEntries";

export const dailyEntryId = (vehicleId: string, drivingDate: string) =>
  `${vehicleId}_${drivingDate}`;

const entryData = (
  calculation: DailyVehicleCalculation,
  existingEntry?: DocumentData
) => ({
  drivingDate: calculation.drivingDate,
  monthKey: calculation.drivingDate.slice(0, 7),
  vehicleId: calculation.vehicle.id,
  vehicleName: calculation.vehicle.name,
  consumptionRate: calculation.vehicle.consumption,
  quantities: calculation.quantities,
  fuel: calculation.fuel,
  createdAt:
    existingEntry?.createdAt instanceof Timestamp
      ? existingEntry.createdAt
      : serverTimestamp(),
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
  calculation: DailyVehicleCalculation
): Promise<SaveEntryResult> => {
  const reference = doc(
    db,
    DAILY_ENTRIES_COLLECTION,
    dailyEntryId(calculation.vehicle.id, calculation.drivingDate)
  );

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
            if (current.exists() && !existing?.exists() && !replacementConfirmed) {
              throw new ConcurrentEntryError();
            }
            transaction.set(reference, entryData(calculation, current.data()));
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

      setDoc(reference, entryData(calculation, existing?.data())).catch(onError);
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
