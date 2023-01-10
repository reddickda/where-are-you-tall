import './App.css';
import { useState } from 'react'
import React from 'react';
import { calculateHeight } from './calculator.js'
import * as d3 from 'd3'
import { heightData } from "./heightData.js";

// TODO https://github.com/vasturiano/react-globe.gl/blob/master/example/choropleth-countries/index.html
  // use react globe.gl choropleth-countries example to create polygons over top countries
  // map country name to iso a2 code (alpha2)

function App() {
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [countriesYouAreTaller, setCountries] = useState<string[]>([])
  const [polyGonDataTaller, setPolyGonDataTaller] = useState()
  const [isFemale, setIsFemale] = useState(false)
  const [hoverD, setHoverD] = useState()
  const toggleSwitch = () => setIsFemale((previousState) => !previousState)
  
  const cData = require('./countryjson.json')
  const alpha2Data = require('./alpha2country.json')

  const mappedalpha2 = heightData
    .map((hd) => {
      const alpha2D = alpha2Data.find((a2d) => {
        return a2d.englishShortName === hd['Country Name']
      })
      if (alpha2D) {
        return { ...hd, alpha2: alpha2D.alpha2Code }
      }
    })
    .filter((v) => v)

  console.log({ mappedalpha2 })

  const cTaller = cData.features.filter((d) =>
    countriesYouAreTaller.includes(d.properties.ISO_A2)
  )

  console.log({cTaller})

  const handlePress = (feet: string, inches: string) => {
    const countries = calculateHeight(feet, inches, isFemale).filter(v => v !== "")

    setCountries(countries)
    console.log(countries)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Find out where in the world you are tall.
        </p>
        <form>
          <div>
            Enter your height:
            <div>
              <label>Feet:
                <input 
                  type="text" 
                  onChange={(e) => setFeet(e.target.value)}/>
              </label>
              <label>Inches:
                <input 
                  type="text" 
                  onChange={(e) => setInches(e.target.value)}/>
              </label>
            </div>
          </div>
        </form>
        <button onClick={() => handlePress(feet, inches)} className="button" style={{verticalAlign:"middle"}}><span>Where am I tall? </span></button>
        <div>
        {countriesYouAreTaller.length > 0 &&
            countriesYouAreTaller.map((country: any, index: number) => {
              let countryFullName = mappedalpha2.find(a => a?.alpha2 === country)?.['Country Name']
              return <p key={index}>{countryFullName}</p>
            })}
        </div>
      </header>
    </div>
  );
}

export default App;
