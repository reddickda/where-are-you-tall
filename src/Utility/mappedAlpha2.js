import { heightData } from "./heightData.js";
const alpha2Data = require('./alpha2country.json')

export const mappedalpha2 = heightData
    .map((hd) => {
      const alpha2D = alpha2Data.find((a2d) => {
        return a2d.englishShortName === hd['Country Name']
      })
      if (alpha2D) {
        return { ...hd, alpha2: alpha2D.alpha2Code }
      }
    })
    .filter((v) => v)