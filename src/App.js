import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DropDown from './Components/DropDown';

const cdata_url = process.env.REACT_APP_CDATA_BASE_URL
const cdata_key = process.env.REACT_APP_CDATA_API_KEY
const wmap_url = process.env.REACT_APP_WMAP_BASE_URL
const wmap_key = process.env.REACT_APP_WMAP_API_KEY

const App = () => {
  const [postCode, setPostCode] = useState('');
  const [cityName, setCityName] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [weather, updateWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [coordinates, setCoordinates] = useState();

  useEffect(() => {
    fetchGeolocation('Kuala Lumpur, 57000');
  }, [])

  useEffect(() => {
    const getData = setTimeout(() => {
      if (cityName !== '' || postCode !== '') {
        fetchGeolocation(cityName+', '+postCode);
      }
    }, 1000)

    return () => clearTimeout(getData)
  }, [cityName, postCode])

  const fetchWeather = async (v) => {
    const params = `${v}&dt=${Date.now()}`
    await fetch(`${wmap_url}?${params}&appid=${wmap_key}`, {
      method: 'GET'
    })
    .then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          updateWeather({...json.current, loc: location});
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  };

 const fetchGeolocation = async (v) => {
    const encodedCode = encodeURIComponent(v);
    await fetch(`${cdata_url}?q=${v}&key=${cdata_key}`, {
      method: 'GET'
    })
    .then((response) => {
      if (response.ok) {
        response.json().then((json) => {
            const cordinate = json.results?.map((x) => ({
                lat: x.geometry?.lat,
                lon: x.geometry?.lng,
                loc: x.formatted,
                value: 'lat='+x.geometry?.lat+'&lon='+x.geometry?.lng
              })
            )
            if (cordinate.length > 0) {
              setCoordinates(cordinate)
            } else {
              setCoordinates(null)
              setLatitude(null)
              setLocation(null)
            }
        });
      }
    }).catch((error) => {
      console.log(error)
    });
  };

  const setPrefLocation = (v) => {
    const item = coordinates.find((item) => item.value === v)
    setLocation(item)
  }

  const handleCityName = e => {
    setCityName(e.target.value)
  }

  const handlePostCode = e => {
    setPostCode(e.target.value)
  }
  
  const handleLatitude = e => {
    setLatitude({label: e.label, value: e.value})
    setPrefLocation(e.value)
  }

  const handleApply = async (e) => {
    e.preventDefault()
    if (latitude === null) {
      updateWeather(null)
    }
    fetchWeather(latitude?.value)
  }

  return (
    <div className="container" style={{borderLeft: '1px solid grey'}}>
      <div className="flex-large">
        <div className="welcome">
          <span>Welcome to weather forecast</span>
          <br/>
        </div>
      </div>
      <div className="flex-large">
        <div className="flex-row">
          <div className="filter-text">
            <span>City name</span>
            <input
              type="text"
              id="cityName"
              name="cityName"
              onChange={handleCityName}
              value={cityName}
            />
          </div>
          <div className="filter-text">
            <span>Postal code</span>
            <input
              type="text"
              id="postCode"
              name="postCode"
              onChange={handlePostCode}
              value={postCode}
            />
          </div>
        </div>
        <div className="flex-row">
          <div className="filter-dropdown">
            <span>Latitude/Longitude</span>
            <DropDown
              data={coordinates?.map((x) => ({
                  label: x.lat.toFixed(2)+' / '+x.lon.toFixed(2),
                  value: x.value
                })
              )}
              value={{
                label:latitude?.label,
                value:latitude?.value
              }}
              handleChange={handleLatitude}
            />
          </div>
          <div className="filter-dropdown">
            <span>Location</span>
            <DropDown
              data={[{
                label: location?.loc,
                value: location?.loc
              }]}
              value={{
                label:location?.loc,
                value:location?.loc
              }}
              isReadOnly={true}
            />
          </div>
        </div>
        <div className="flex-row">
          <div className="apply">
            <input type="submit"
              onClick={handleApply}
              value="Apply" />
          </div>
        </div>
      </div>
      <div className="flex-large" 
        style={{borderTop: '1px solid gray'}}>
        <div className="flex-row">
        {weather !== undefined && weather !== null ?
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Wind speed</th>
                <th>Weather description</th>
              </tr>
            </thead>
            <tbody>
                <tr key={weather?.weather?.id} data-testid="table-test">
                  <td width="15%">{moment.unix(weather?.dt).format("dddd, MMMM Do, YYYY h:mm A")}</td>
                  <td width="15%">{weather?.loc?.loc}</td>
                  <td>{Math.floor(weather?.temp-273.15)}°C</td>
                  <td>{weather?.humidity}%</td>
                  <td>{Math.floor(weather?.wind_speed*2.2369)} mph</td>
                  <td>{weather?.weather?.map((x) => x.description)}</td>
                </tr>
            </tbody>
          </table>
          : <span>No data available, please input location properly.</span>}
        </div>
      </div>
    </div>
  );
}
export default App;
