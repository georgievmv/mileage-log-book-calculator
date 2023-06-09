import React from 'react';
import { Car } from '../App';
import { useState } from 'react';

const Form: React.FC<{
  setSelectedCar: React.Dispatch<React.SetStateAction<Car>>;
  selectedCar: Car;
}> = ({ selectedCar, setSelectedCar }) => {
  const [km, setKm] = useState<number>();
  const [city, setCity] = useState<number>();
  const [winter, setWinter] = useState<number>();
  const [convoy, setConvoy] = useState<number>();
  const [ac, setAc] = useState<number>();
  const [garage, setGarage] = useState<number>(1);

  const [resultKm, setResultKm] = useState<number>(0);
  const [resultCity, setResultCity] = useState<number>(0);
  const [resultWinter, setResultWinter] = useState<number>(0);
  const [resultConvoy, setResultConvoy] = useState<number>(0);
  const [resultAc, setResultAc] = useState<number>(0);
  const [resultGarage, setResultGarage] = useState<number>(0);

  const garageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.currentTarget.value) > 2) {
      return;
    }
    setGarage(parseInt(e.currentTarget.value));
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (km) {
      const result = (km * selectedCar.consumption) / 100;
      setResultKm(result);
      setResultGarage(selectedCar.consumption * 0.02 * garage);
    }
    if (city) {
      const resultCity = ((city * selectedCar.consumption) / 100) * 0.1;
      setResultCity(resultCity);
    }
    if (winter) {
      const resultWinter = ((winter * selectedCar.consumption) / 100) * 0.1;
      setResultWinter(resultWinter);
    }
    if (ac) {
      const resultAc = ((ac * selectedCar.consumption) / 100) * 0.1;
      setResultAc(resultAc);
    }
    if (convoy) {
      const resultConvoy = ((convoy * selectedCar.consumption) / 100) * 0.25;
      setResultConvoy(resultConvoy);
    }
  };

  const backClickHandler = () => {
    setSelectedCar({ name: '', consumption: 0, img: '' });
  };

  return (
    <div className="form-container">
      <img className="background-image" src={selectedCar.img} alt="" />
      <form className="form" onSubmit={formSubmitHandler}>
        <h1>{selectedCar.name}</h1>
        <div className="form-group">
          <div className="left-hand-side">
            <input
              id="km"
              value={km}
              min={0}
              max={999}
              onChange={(e) => setKm(parseInt(e.target.value))}
              type="number"
              name="km"
            />
            <p>км по основна разходна норма ({selectedCar.consumption} %)</p>
          </div>
          <p className="result">{!!resultKm && resultKm?.toFixed(3)}</p>
        </div>
        <div className="form-group">
          <div className="left-hand-side">
            <input
              id="city"
              name="city"
              type="number"
              onChange={(e) => {
                setCity(parseInt(e.target.value));
              }}
              value={city}
              min={0}
              max={999}
            />
            <p>км в градски условия (10%)</p>
          </div>
          <p className="result">{!!resultCity && resultCity?.toFixed(3)}</p>
        </div>
        <div className="form-group">
          <div className="left-hand-side">
            <input
              id="winter"
              name="winter"
              onChange={(e) => {
                setWinter(parseInt(e.target.value));
              }}
              value={winter}
              min={0}
              max={999}
              type="number"
            />
            <p>км в зимни условия (10%)</p>
          </div>
          <p className="result">{!!resultWinter && resultWinter?.toFixed(3)}</p>
        </div>
        <div className="form-group">
          <div className="left-hand-side">
            <input
              id="convoy"
              name="convoy"
              type="number"
              onChange={(e) => {
                setConvoy(parseInt(e.target.value));
              }}
              value={convoy}
              min={0}
              max={999}
            />
            <p>км в колона (25%)</p>
          </div>
          <p className="result">{!!resultConvoy && resultConvoy?.toFixed(3)}</p>
        </div>
        <div className="form-group">
          <div className="left-hand-side">
            <input
              id="ac"
              name="ac"
              type="number"
              onChange={(e) => {
                setAc(parseInt(e.target.value));
              }}
              value={ac}
              min={0}
              max={999}
            />
            <p>с включен климатик (10%)</p>
          </div>
          <p className="result">{!!resultAc && resultAc?.toFixed(3)}</p>
        </div>
        <div className="form-group">
          <div className="left-hand-side">
            <p>Вътрешно гаражни</p>
            <input onChange={garageChangeHandler} value={garage} max={2} min={1} type="number" />
            <p>дни по (2%)</p>
          </div>
          <p className="result">{!!resultGarage && resultGarage?.toFixed(3)}</p>
        </div>
        {!!resultKm && (
          <div className="combined">
            <p>Общо</p>
            <p className="result">
              {(
                resultAc +
                resultCity +
                resultConvoy +
                resultGarage +
                resultKm +
                resultWinter
              ).toFixed(3)}
            </p>
          </div>
        )}
        <button type="submit">Пресметни</button>
        <button onClick={backClickHandler} type="button">
          Назад
        </button>
      </form>
    </div>
  );
};

export default Form;
