import './App.css';
import Form from './pages/Form';
import Cars from './pages/Cars';
import { useState } from 'react';
export type Car = {
  name: string;
  consumption: number;
  img: string;
};
const cars: Car[] = [
  {
    name: 'Мицубиши',
    consumption: 8.19,
    img: '806855-Cruze-Chevrolet-Back-view.jpg',
  },
  {
    name: 'Форд Фиеста',
    consumption: 8,
    img: 'ford-fiesta.jpg',
  },
  {
    name: 'Лада Нива',
    consumption: 10.5,
    img: 'mountains-lada-niva-ваз2121-lada-niva-wallpaper-preview.jpg',
  },
  {
    name: 'Рено Меган',
    consumption: 6.5,
    img: "IMG_1885.JPEG",
  },
];

function App() {
  const [selectedCar, setSelectedCar] = useState<Car>({ name: '', consumption: 0, img: '' });
  return (
    <div className="App">
      {!selectedCar.name && <Cars setSelectedCar={setSelectedCar} cars={cars} />}
      {selectedCar.name && <Form setSelectedCar={setSelectedCar} selectedCar={selectedCar} />}
    </div>
  );
}

export default App;
