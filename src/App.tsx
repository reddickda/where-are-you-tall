import './App.css';
import { useState, useMemo } from 'react'
import React from 'react';
import { calculateHeight } from './calculator.js'
import * as d3 from 'd3'
import { Button, Card, Grid, Stack, NumberInput } from '@mantine/core';
import { mappedalpha2 } from './Utility/mappedAlpha2';
import Globe from 'react-globe.gl'
import { heightData } from "./Utility/heightData.js";

let countryjson = require('./countryjson.json');

// TODO https://github.com/vasturiano/react-globe.gl/blob/master/example/choropleth-countries/index.html
// use react globe.gl choropleth-countries example to create polygons over top countries
// map country name to iso a2 code (alpha2)

function App() {
  const [feet, setFeet] = useState<number | ''>(0)
  const [inches, setInches] = useState<number | ''>(0)
  const [countriesYouAreTaller, setCountriesYouAreTaller] = useState<string[]>([])
  const [isFemale, setIsFemale] = useState(false)
  const [hoverD, setHoverD] = useState()

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

  // GDP per capita (avoiding countries with small pop)
  // Get avg height based on the iso 2 from our country data
  const getVal = feat => { console.log(feat); const avgHeight = heightData['alpha2'] === feat.propert9ies.ISO_A2; return avgHeight};

  const maxVal = useMemo(
    () => Math.max(...countryjson.features.map(getVal)),
    [countryjson]
  );

  colorScale.domain([0, maxVal]);

  const handlePress = (feet: number | '', inches: number | '') => {
    const countries = calculateHeight(feet, inches, isFemale).filter(v => v !== "")

    setCountriesYouAreTaller(countries)
  }

  return (
    <Stack>
      <header className="App-header">
        <p>
          Find out where in the world you are tall.
        </p>
        <Grid>
          <Grid.Col sm={6} xs={12}>
            <Button size={'lg'} onClick={() => setIsFemale(false)} style={{ boxShadow: isFemale ? undefined : '2px 1px 1px black', backgroundColor: isFemale ? "#124182" : "#008040" }}>Male</Button>
          </Grid.Col>
          <Grid.Col sm={6} xs={12}>
            <Button size={'lg'} onClick={() => setIsFemale(true)} style={{ boxShadow: isFemale ? '2px 1px 1px black' : undefined, backgroundColor: isFemale ? "#008040" : "#124182" }}>Female</Button>
          </Grid.Col>
        </Grid>
        <form>
          <Stack pt={20} pb={10}>
            <Card>
              Enter your height:
              <Grid>
                <Grid.Col>
                  <NumberInput value={feet} onChange={setFeet} label='Feet' defaultValue={''} />
                </Grid.Col>
                <Grid.Col>
                  <NumberInput value={inches} onChange={setInches} label='Inches' defaultValue={''} />
                </Grid.Col>
              </Grid>
            </Card>
          </Stack>
        </form>
        <Button style={{ backgroundColor: "#124182"}} onClick={() => handlePress(feet, inches)}>Where am I tall?</Button>
        <div>
          {countriesYouAreTaller.length > 0 ?
            <div>You are tall somewhere!</div> : <div>You are not tall anywhere...</div>}
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
          `)
          }}
          onPolygonHover={setHoverD}
          polygonsTransitionDuration={300}
        />
      </header>
    </Stack>
  );
}

export default App;
