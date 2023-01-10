import './App.css';
import { useState, useMemo } from 'react'
import React from 'react';
import { calculateHeight } from './calculator.js'
import * as d3 from 'd3'
import { heightData } from "./heightData.js";
import Globe from 'react-globe.gl'
let countryjson = require('./countryjson.json');

// TODO https://github.com/vasturiano/react-globe.gl/blob/master/example/choropleth-countries/index.html
  // use react globe.gl choropleth-countries example to create polygons over top countries
  // map country name to iso a2 code (alpha2)

function App() {
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [countriesYouAreTaller, setCountries] = useState<string[]>([])
  const [isFemale, setIsFemale] = useState(false)
  const [hoverD, setHoverD] = useState()

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

    // GDP per capita (avoiding countries with small pop)
  const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  const cData = require('./countryjson.json')
  const alpha2Data = require('./alpha2country.json')

  // should just call these on button press not every render
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

    const getAvgHeight = a2 => { 
      let maleOrFemale = isFemale ? "Female Height in Ft" : "Male Height in Ft"
      let avgHeight = mappedalpha2.find(a => a?.alpha2 === a2)?.[maleOrFemale];
      return avgHeight;
    }
  
    const maxVal = useMemo(
      () => Math.max(...countryjson.features.map(getVal)),
      [countryjson]
    );
    colorScale.domain([0, maxVal]);

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
        <div>
          <button onClick={() => setIsFemale(false)} style={{backgroundColor: isFemale ? "#1d68d1" : "#1dd19b"}} className="maleFemaleButton" ><span>Male </span></button>
          <button onClick={() => setIsFemale(true)} style={{backgroundColor: isFemale ? "#1dd19b" : "#1d68d1"}} className="maleFemaleButton" ><span>Female </span></button>
        </div>
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
           <div>You are tall somewhere!</div>}
            
        {/* {countriesYouAreTaller.length > 0 &&
            countriesYouAreTaller.map((country: any, index: number) => {
              let countryFullName = mappedalpha2.find(a => a?.alpha2 === country)?.['Country Name']
              return <p key={index}>{countryFullName}</p>
            })} */}
        </div>
        <Globe
        width={500}
        height={500}
        backgroundColor="rgb(59, 62, 63)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        lineHoverPrecision={0}
        polygonsData={countryjson.features.filter(d => countriesYouAreTaller.find(a => a === d.properties.ISO_A2))}
        polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
        polygonCapColor={d => d === hoverD ? 'steelblue' : colorScale(getVal(d))}// colorScale(getAvgHeight(d.properties.ISO_A2))}
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
        polygonStrokeColor={() => '#111'}
        polygonLabel={({ properties: d }) => {
          let maleOrFemale = isFemale ? "Female Height in Ft" : "Male Height in Ft"
          let avgHeight = mappedalpha2.find(a => a?.alpha2 === d.ISO_A2)?.[maleOrFemale];
          return (`
        <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          Avg Height: <i>${avgHeight}</i>
      `)} }
        onPolygonHover={setHoverD}
        polygonsTransitionDuration={300}
        />
      </header>
    </div>
  );
}

export default App;
