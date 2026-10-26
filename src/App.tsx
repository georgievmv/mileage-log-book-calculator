import "./App.css";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebase } from "./firebase";
import Cars from "./pages/Cars";
import Form from "./pages/Form";
import Login from "./pages/Login";
import MonthlyLog from "./pages/MonthlyLog";

export type Car = { id: string; name: string; consumption: number; img: string };

const emptyCar: Car = { id: "", name: "", consumption: 0, img: "" };
const cars: Car[] = [
  { id: "chevrolet", name: "Шевролет", consumption: 8.5, img: "806855-Cruze-Chevrolet-Back-view.jpg" },
  { id: "mitsubishi", name: "Мицубиши", consumption: 8.19, img: "806855-Cruze-Chevrolet-Back-view.jpg" },
  { id: "ford-fiesta", name: "Форд Фиеста", consumption: 8, img: "ford-fiesta.jpg" },
  { id: "lada-niva", name: "Лада Нива", consumption: 10.5, img: "mountains-lada-niva-ваз2121-lada-niva-wallpaper-preview.jpg" },
  { id: "renault-megane", name: "Рено Меган", consumption: 6.5, img: "IMG_1885.JPEG" },
];

type Page = "calculator" | "monthly-log";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [page, setPage] = useState<Page>("calculator");
  const [selectedCar, setSelectedCar] = useState<Car>(emptyCar);

  useEffect(() => {
    let unsubscribe: () => void = () => undefined;
    let isCancelled = false;
    if (!firebase.ready) {
      setIsCheckingAuth(false);
      return unsubscribe;
    }
    const { auth, authPersistenceReady } = firebase;
    authPersistenceReady.catch(() => undefined).finally(() => {
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
    return <main className="configuration-error" role="alert"><h1>Грешка в конфигурацията</h1><p>{firebase.error}</p></main>;
  }
  const firebaseServices = firebase;
  if (isCheckingAuth) return <main className="loading-page">Зареждане…</main>;
  if (!user) return <Login auth={firebaseServices.auth} authPersistenceReady={firebaseServices.authPersistenceReady} />;

  return (
    <div className="App">
      <header className="app-header">
        <nav aria-label="Основна навигация">
          <button aria-current={page === "calculator" ? "page" : undefined} onClick={() => setPage("calculator")} type="button">Калкулатор</button>
          <button aria-current={page === "monthly-log" ? "page" : undefined} onClick={() => setPage("monthly-log")} type="button">Месечен дневник</button>
        </nav>
        <button className="logout-button" onClick={() => signOut(firebaseServices.auth)} type="button">Изход</button>
      </header>
      {page === "monthly-log" ? <MonthlyLog /> : selectedCar.name ? (
        <Form db={firebaseServices.db} setSelectedCar={setSelectedCar} selectedCar={selectedCar} />
      ) : (
        <Cars setSelectedCar={setSelectedCar} cars={cars} />
      )}
    </div>
  );
}

export default App;
