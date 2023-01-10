import { heightData } from "./heightData.js";

export const calculateHeight = (feet, inches, isMale) => {

    let heightInCm = feet*30.48;
    heightInCm += inches*2.54

    // TODO return alpha2
    const countries = heightData.map((data) => {
        if(isMale){
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