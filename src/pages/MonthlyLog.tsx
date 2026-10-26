import { collection, deleteDoc, doc, Firestore, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Car } from "../App";
import { DailyVehicleEntry } from "../dailyEntry";
import { DAILY_ENTRIES_COLLECTION } from "../dailyEntries";

const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("bg-BG", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

const formatTimestamp = (value: Timestamp | null) => value
  ? new Intl.DateTimeFormat("bg-BG", { dateStyle: "medium", timeStyle: "short" }).format(value.toDate())
  : "Изчаква синхронизиране";

const numberValue = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : 0;

const entryFromDocument = (id: string, data: Record<string, unknown>): DailyVehicleEntry => {
  const quantities = (data.quantities ?? {}) as Record<string, unknown>;
  const fuel = (data.fuel ?? {}) as Record<string, unknown>;
  return {
    id,
    drivingDate: String(data.drivingDate ?? ""),
    vehicle: { id: String(data.vehicleId ?? ""), name: String(data.vehicleName ?? ""), consumption: numberValue(data.consumptionRate), img: "" },
    quantities: {
      totalDistance: numberValue(quantities.totalDistance), cityDistance: numberValue(quantities.cityDistance),
      winterDistance: numberValue(quantities.winterDistance), convoyDistance: numberValue(quantities.convoyDistance),
      airConditioningDistance: numberValue(quantities.airConditioningDistance), garageDays: numberValue(quantities.garageDays),
    },
    fuel: {
      base: numberValue(fuel.base), city: numberValue(fuel.city), winter: numberValue(fuel.winter),
      convoy: numberValue(fuel.convoy), airConditioning: numberValue(fuel.airConditioning),
      garage: numberValue(fuel.garage), total: numberValue(fuel.total),
    },
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : null,
  };
};

const columns = [
  ["totalDistance", "Общо км", "quantity"], ["cityDistance", "Градски км", "quantity"],
  ["winterDistance", "Зимни км", "quantity"], ["convoyDistance", "Км в колона", "quantity"],
  ["airConditioningDistance", "Км с климатик", "quantity"], ["garageDays", "Гаражни дни", "quantity"],
  ["base", "Основно гориво", "fuel"], ["city", "Градско гориво", "fuel"],
  ["winter", "Зимно гориво", "fuel"], ["convoy", "Гориво в колона", "fuel"],
  ["airConditioning", "Гориво климатик", "fuel"], ["garage", "Гаражно гориво", "fuel"],
  ["total", "Общо гориво", "fuel"],
] as const;

const MonthlyLog: React.FC<{ db: Firestore; cars: Car[]; onEdit: (entry: DailyVehicleEntry) => void }> = ({ db, cars, onEdit }) => {
  const [vehicleId, setVehicleId] = useState(cars[0]?.id ?? "");
  const [month, setMonth] = useState(currentMonth);
  const [entries, setEntries] = useState<DailyVehicleEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isCached, setIsCached] = useState(false);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);
  const [retry, setRetry] = useState(0);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!vehicleId || !month) return;
    setStatus("loading");
    setDeleteError("");
    const monthlyQuery = query(collection(db, DAILY_ENTRIES_COLLECTION), where("vehicleId", "==", vehicleId), where("monthKey", "==", month));
    return onSnapshot(monthlyQuery, { includeMetadataChanges: true }, (snapshot) => {
      setEntries(snapshot.docs.map((item) => entryFromDocument(item.id, item.data())).sort((a, b) => a.drivingDate.localeCompare(b.drivingDate)));
      setIsCached(snapshot.metadata.fromCache);
      setHasPendingWrites(snapshot.metadata.hasPendingWrites);
      setStatus("ready");
    }, () => setStatus("error"));
  }, [db, month, retry, vehicleId]);

  const totals = useMemo(() => entries.reduce((result, entry) => {
    (Object.keys(result.quantities) as Array<keyof typeof result.quantities>).forEach((key) => { result.quantities[key] += entry.quantities[key]; });
    (Object.keys(result.fuel) as Array<keyof typeof result.fuel>).forEach((key) => { result.fuel[key] += entry.fuel[key]; });
    return result;
  }, {
    quantities: { totalDistance: 0, cityDistance: 0, winterDistance: 0, convoyDistance: 0, airConditioningDistance: 0, garageDays: 0 },
    fuel: { base: 0, city: 0, winter: 0, convoy: 0, airConditioning: 0, garage: 0, total: 0 },
  }), [entries]);

  const remove = async (entry: DailyVehicleEntry) => {
    if (!window.confirm(`Да се изтрие ли записът за ${entry.vehicle.name} от ${formatDate(entry.drivingDate)}?`)) return;
    setDeleteError("");
    try { await deleteDoc(doc(db, DAILY_ENTRIES_COLLECTION, entry.id)); }
    catch { setDeleteError("Записът не беше изтрит. Данните са запазени — опитайте отново."); }
  };

  return <main className="monthly-log">
    <h1>Месечен дневник</h1>
    <div className="monthly-filters">
      <label>Автомобил<select value={vehicleId} onChange={(event) => { setEntries([]); setVehicleId(event.target.value); }}>{cars.map((car) => <option key={car.id} value={car.id}>{car.name}</option>)}</select></label>
      <label>Месец<input type="month" value={month} onChange={(event) => { setEntries([]); setMonth(event.target.value); }} /></label>
    </div>
    <p className="concurrency-note">При едновременни корекции се запазва последната записана версия. Часът на последната промяна е показан за всеки запис.</p>
    {status === "loading" && <p role="status">Зареждане на месечния дневник…</p>}
    {status === "error" && <div role="alert"><p>Дневникът не може да бъде прочетен. Показаните данни може да са остарели.</p><button type="button" onClick={() => setRetry((value) => value + 1)}>Опитай отново</button></div>}
    {status === "ready" && isCached && <p className="cache-status" role="status">Показват се запазени данни от устройството. Те може да са остарели, докато няма връзка.</p>}
    {hasPendingWrites && <p className="cache-status" role="status">Има промени, които чакат синхронизиране.</p>}
    {deleteError && <p role="alert">{deleteError}</p>}
    {status === "ready" && entries.length === 0 ? <p>Няма записи за избрания автомобил и месец.</p> : entries.length > 0 && <div className="monthly-table-wrap"><table className="monthly-table">
      <thead><tr><th>Дата</th>{columns.map(([key, label]) => <th key={key}>{label}</th>)}<th>Последна промяна</th><th>Действия</th></tr></thead>
      <tbody>{entries.map((entry) => <tr key={entry.id}><th scope="row">{formatDate(entry.drivingDate)}</th>
        {columns.map(([key, , group]) => <td key={key}>{group === "fuel" ? entry.fuel[key].toFixed(3) : entry.quantities[key]}</td>)}
        <td>{formatTimestamp(entry.updatedAt)}</td><td className="row-actions"><button type="button" onClick={() => onEdit(entry)}>Редактирай</button><button type="button" onClick={() => remove(entry)}>Изтрий</button></td></tr>)}</tbody>
      <tfoot><tr><th scope="row">Общо</th>{columns.map(([key, , group]) => <td key={key}>{group === "fuel" ? totals.fuel[key].toFixed(3) : totals.quantities[key]}</td>)}<td colSpan={2} /></tr></tfoot>
    </table></div>}
  </main>;
};

export default MonthlyLog;
