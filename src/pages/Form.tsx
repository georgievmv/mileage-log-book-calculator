import React from 'react';
import { Car } from '../App';
import { useState } from 'react';

const Form: React.FC<{
  setSelectedCar: React.Dispatch<React.SetStateAction<Car>>;
  selectedCar: Car;
}> = ({ selectedCar, setSelectedCar }) => {
  const [km, setKm] = useState<number | string>();
  const [city, setCity] = useState<number | string>();
  const [winter, setWinter] = useState<number | string>();
  const [convoy, setConvoy] = useState<number | string>();
  const [ac, setAc] = useState<number | string>();
  const [garage, setGarage] = useState<number | string>(1);

  const [resultKm, setResultKm] = useState<number>(0);
  const [resultCity, setResultCity] = useState<number>(0);
  const [resultWinter, setResultWinter] = useState<number>(0);
  const [resultConvoy, setResultConvoy] = useState<number>(0);
  const [resultAc, setResultAc] = useState<number>(0);
  const [resultGarage, setResultGarage] = useState<number>(0);

  const garageChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGarage(parseInt(e.currentTarget.value));
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (km) {
      const result = ((km as number) * selectedCar.consumption) / 100;
      setResultKm(result);
      setResultGarage(selectedCar.consumption * 0.02 * (garage as number));
    }
    if (city) {
      const resultCity = (((city as number) * selectedCar.consumption) / 100) * 0.1;
      setResultCity(resultCity);
    }
    if (winter) {
      const resultWinter = (((winter as number) * selectedCar.consumption) / 100) * 0.1;
      setResultWinter(resultWinter);
    }
    if (ac) {
      const resultAc = (((ac as number) * selectedCar.consumption) / 100) * 0.1;
      setResultAc(resultAc);
    }
    if (convoy) {
      const resultConvoy = (((convoy as number) * selectedCar.consumption) / 100) * 0.25;
      setResultConvoy(resultConvoy);
    }
  };

  const backClickHandler = () => {
    setSelectedCar({ name: '', consumption: 0, img: '' });
  };

  const againClickHandler = () => {
    setKm('');
    setCity('');
    setWinter('');
    setConvoy('');
    setAc('');
    setGarage(1);
    setResultKm(0);
    setResultCity(0);
    setResultWinter(0);
    setResultConvoy(0);
    setResultAc(0);
    setResultGarage(0);
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
              max={5000}
              onChange={(e) => setKm(parseInt(e.target.value))}
              type="number"
              name="km"
            />
            <p>км по основна разходна норма ({selectedCar.consumption} %)</p>
          </div>
          <p className="result">{!!resultKm && (Math.trunc(resultKm * 1000) / 1000).toFixed(3)}</p>
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
              max={5000}
            />
            <p>км в градски условия (10%)</p>
          </div>
          <p className="result">
            {!!resultCity && (Math.trunc(resultCity * 1000) / 1000).toFixed(3)}
          </p>
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
              max={5000}
              type="number"
            />
            <p>км в зимни условия (10%)</p>
          </div>
          <p className="result">
            {!!resultWinter && (Math.trunc(resultWinter * 1000) / 1000).toFixed(3)}
          </p>
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
              max={5000}
            />
            <p>км в колона (25%)</p>
          </div>
          <p className="result">
            {!!resultConvoy && (Math.trunc(resultConvoy * 1000) / 1000).toFixed(3)}
          </p>
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
              max={5000}
            />
            <p>с включен климатик (10%)</p>
          </div>
          <p className="result">{!!resultAc && (Math.trunc(resultAc * 1000) / 1000).toFixed(3)}</p>
        </div>
        <div className="form-group">
          <div className="left-hand-side">
            <p>Вътрешно гаражни</p>
            <input onChange={garageChangeHandler} value={garage} max={31} min={1} type="number" />
            <p>дни по (2%)</p>
          </div>
          <p className="result">
            {!!resultGarage && (Math.trunc(resultGarage * 1000) / 1000).toFixed(3)}
          </p>
        </div>
        {!!resultKm && (
          <div className="combined">
            <p>Общо</p>
            <p className="result">
              {(
                Math.trunc(
                  (resultAc + resultCity + resultConvoy + resultGarage + resultKm + resultWinter) *
                    1000
                ) / 1000
              ).toFixed(3)}
            </p>
          </div>
        )}
        <button className="form-button" type="submit">
          Пресметни
        </button>
        <button className="form-button" onClick={backClickHandler} type="button">
          Назад
        </button>
        <button className="form-button" onClick={againClickHandler} type="button">
          Отначало
        </button>
      </form>
    </div>
  );
};

export default Form;
