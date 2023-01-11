import { heightData } from "./Utility/heightData.js";

export const calculateHeight = (feet, inches, isFemale) => {
    let heightInCm = feet*30.48;
    heightInCm += inches*2.54
    
    const countries = heightData.map((data) => {
        if(!isFemale){
            if(data["Male Height in Cm"] < heightInCm) {
                return data.alpha2
            }
        }else {
            if(data["Female Height in Cm"] < heightInCm) {
                return data.alpha2
            }
        }
        return ""
    })

    return countries || []
}