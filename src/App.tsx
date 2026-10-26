import "./App.css";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebase } from "./firebase";
import Cars from "./pages/Cars";
import Form from "./pages/Form";
import Login from "./pages/Login";
import MonthlyLog from "./pages/MonthlyLog";
import { DailyVehicleEntry } from "./dailyEntry";

export type Car = {
  id: string;
  name: string;
  consumption: number;
  img: string;
};

const emptyCar: Car = { id: "", name: "", consumption: 0, img: "" };
const cars: Car[] = [
  {
    id: "chevrolet",
    name: "Шевролет",
    consumption: 8.5,
    img: "806855-Cruze-Chevrolet-Back-view.jpg",
  },
  {
    id: "mitsubishi",
    name: "Мицубиши",
    consumption: 8.19,
    img: "806855-Cruze-Chevrolet-Back-view.jpg",
  },
  {
    id: "ford-fiesta",
    name: "Форд Фиеста",
    consumption: 8,
    img: "ford-fiesta.jpg",
  },
  {
    id: "lada-niva",
    name: "Лада Нива",
    consumption: 10.5,
    img: "mountains-lada-niva-ваз2121-lada-niva-wallpaper-preview.jpg",
  },
  {
    id: "renault-megane",
    name: "Рено Меган",
    consumption: 6.5,
    img: "IMG_1885.JPEG",
  },
];

type Page = "calculator" | "monthly-log";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [page, setPage] = useState<Page>("calculator");
  const [selectedCar, setSelectedCar] = useState<Car>(emptyCar);
  const [editingEntry, setEditingEntry] = useState<DailyVehicleEntry | null>(
    null,
  );

  useEffect(() => {
    let unsubscribe: () => void = () => undefined;
    let isCancelled = false;
    if (!firebase.ready) {
      setIsCheckingAuth(false);
      return unsubscribe;
    }
    const { auth, authPersistenceReady } = firebase;
    authPersistenceReady
      .catch(() => undefined)
      .finally(() => {
        if (isCancelled) return;
        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser);
          setIsCheckingAuth(false);
        });
      });
    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, []);

  if (!firebase.ready) {
    return (
      <main className="configuration-error" role="alert">
        <h1>Грешка в конфигурацията</h1>
        <p>{firebase.error}</p>
      </main>
    );
  }
  const firebaseServices = firebase;
  if (isCheckingAuth) return <main className="loading-page">Зареждане…</main>;
  if (!user)
    return (
      <Login
        auth={firebaseServices.auth}
        authPersistenceReady={firebaseServices.authPersistenceReady}
      />
    );

  return (
    <div className="App">
      <header className="app-header">
        <nav aria-label="Основна навигация">
          <button
            aria-current={page === "calculator" ? "page" : undefined}
            onClick={() => {
              setEditingEntry(null);
              setPage("calculator");
            }}
            type="button"
          >
            Калкулатор
          </button>
          <button
            aria-current={page === "monthly-log" ? "page" : undefined}
            onClick={() => {
              setEditingEntry(null);
              setPage("monthly-log");
            }}
            type="button"
          >
            Месечен дневник
          </button>
        </nav>
        {/* <button
          aria-label="Изход"
          className="logout-button"
          onClick={() => signOut(firebaseServices.auth)}
          title="Изход"
          type="button"
        >
          <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10M14.5 8.5 18 12l-3.5 3.5M9 12h9"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button> */}
      </header>
      {page === "monthly-log" ? (
        <MonthlyLog
          db={firebaseServices.db}
          cars={cars}
          onEdit={(entry) => {
            setEditingEntry(entry);
            setSelectedCar(
              cars.find((car) => car.id === entry.vehicle.id) ?? entry.vehicle,
            );
            setPage("calculator");
          }}
        />
      ) : selectedCar.name ? (
        <Form
          key={editingEntry?.id ?? selectedCar.id}
          db={firebaseServices.db}
          cars={cars}
          editingEntry={editingEntry}
          setSelectedCar={setSelectedCar}
          selectedCar={selectedCar}
        />
      ) : (
        <Cars setSelectedCar={setSelectedCar} cars={cars} />
      )}
    </div>
  );
}

export default App;
