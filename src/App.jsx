import React, { useEffect, useState } from 'react'
import './App.css'
import clear from './assets/clear.png';
import clouds from './assets/clouds.png';
import drizzle from './assets/drizzle.png';
import humidity from './assets/humidity.png';
import mist from './assets/mist.png';
import rain from './assets/rain.png';
import snow from './assets/snow.png';
import wind from './assets/wind.png';
import search from './assets/search.png';

// moved it outside component as it was being created on every render
const allIcons={
    "01d": clear,
    "01n":clear,
    "02d":clouds,
    "02n":clouds,
    "03d":clouds,
    "03n":clouds,
    "04d":clouds,
    "04n":clouds,
    "09d":drizzle,
    "09n":drizzle,
    "50d":mist,
     "50n":mist,
     "10d":rain,
     "10n":rain,
     "11d":rain,
     "11n":rain,
     "13d":snow,
     "13n":snow
  }


const App = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [weather, setWeather] = useState(null)



  const addCity = async (cityName) => {
    if (!cityName) {
      alert("enter city first!")
      return
    }

    setError('');
    setLoading(true);
    setWeather(null);

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${import.meta.env.VITE_APP_ID}&units=metric`
      )

      if (!response.ok) {
        throw new Error('city not found');
      }
      const data = await response.json();
      console.log(data);

      // store only what is needed
      setWeather({
        name: data.name,
        temp: data.main.temp,
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        speed: data.wind.speed,
        icon:data.weather[0].icon
      });
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false);
      setCity('');

    }
  };

  // for lahore data to display on app load
  useEffect(() => {
    addCity('lahore');
  }, [])


  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-300">

      {/* Search Card-parent */}
      <div className="p-6 bg-purple-700 rounded-xl shadow-lg flex flex-col gap-4 w-96">

        {/* Input + Button */}
        <div className="flex gap-4">
          <input
            className="border p-2 rounded-2xl shadow-lg flex-1"
            type="text"
            placeholder="Enter City..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded-full shadow-lg"
            onClick={()=>addCity(city)}
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-white text-center">Loading...</p>}

        {/* Error */}
        {error && <p className="text-red-300 text-center">{error}</p>}

        {/*Weather Card*/}
        {weather && (
          <div className="bg-purple-600 rounded-lg p-4 text-white text-center">
            <img src={allIcons[weather.icon]||clear} alt={weather.condition} className='weather-icon mx-10' />
            <h2 className="text-xl font-bold">{weather.name}</h2>
            <p>{weather.temp}°C</p>
            <p className="mb-3">{weather.condition}</p>

            <div className="flex justify-between text-sm my-1">
              <div>
                <img src={humidity} alt="" className='weather-icon' />
                <p className="font-semibold my-3">Humidity</p>
                <p>{weather.humidity}%</p>
              </div>

              <div>
                <img src={wind} alt="" className='weather-icon' />
                <p className="font-semibold my-2">Wind</p>
                <p>{weather.speed} km/h</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );


};

export default App;
