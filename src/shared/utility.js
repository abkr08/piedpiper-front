import React from 'react';
import { endCall } from '../store/actions/actionIndex';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const checkValidity = (value, rules) => {
    
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}

export const getSVG = (name, fill, height, width) => {
    switch(name) {
        case 'video':
            return (
                <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 16 20" width={width} height={height}>
                    <path fill={fill} fillOpacity=".4" d="M15.243 5.868l-3.48 3.091v-2.27c0-.657-.532-1.189-1.189-1.189H1.945c-.657 0-1.189.532-1.189 1.189v7.138c0 .657.532 1.189 1.189 1.189h8.629c.657 0 1.189-.532 1.189-1.189v-2.299l3.48 3.09v-8.75z" />
                </svg>
            );
        case 'voice':
            return (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -256 1792 1792"
                id="svg3013"
                version="1.1"
                width={width}
                height={height}
                >
                    <path
                    transform="matrix(1,0,0,-1,159.45763,1293.0169)"
                    d="m 1408,296 q 0,-27 -10,-70.5 Q 1388,182 1377,157 1356,107 1255,51 1161,0 1069,0 1042,0 1016.5,3.5 991,7 959,16 927,25 911.5,30.5 896,36 856,51 816,66 807,69 709,104 632,152 504,231 367.5,367.5 231,504 152,632 104,709 69,807 66,816 51,856 36,896 30.5,911.5 25,927 16,959 7,991 3.5,1016.5 0,1042 0,1069 q 0,92 51,186 56,101 106,122 25,11 68.5,21 43.5,10 70.5,10 14,0 21,-3 18,-6 53,-76 11,-19 30,-54 19,-35 35,-63.5 16,-28.5 31,-53.5 3,-4 17.5,-25 14.5,-21 21.5,-35.5 7,-14.5 7,-28.5 0,-20 -28.5,-50 -28.5,-30 -62,-55 -33.5,-25 -62,-53 -28.5,-28 -28.5,-46 0,-9 5,-22.5 5,-13.5 8.5,-20.5 3.5,-7 14,-24 10.5,-17 11.5,-19 76,-137 174,-235 98,-98 235,-174 2,-1 19,-11.5 17,-10.5 24,-14 7,-3.5 20.5,-8.5 13.5,-5 22.5,-5 18,0 46,28.5 28,28.5 53,62 25,33.5 55,62 30,28.5 50,28.5 14,0 28.5,-7 14.5,-7 35.5,-21.5 21,-14.5 25,-17.5 25,-15 53.5,-31 28.5,-16 63.5,-35 35,-19 54,-30 70,-35 76,-53 3,-7 3,-21 z"
                    id="path3017"
                    fill={fill} fillOpacity=".4"
                    />
                </svg>
            );
        case 'ellipsis':
            return (
                <svg id="Layer_1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" width={width} 
                height={height}>
                    <path fill={fill}
                    fillOpacity=".6" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z">
                    </path>
                </svg>
            )
        case 'endCall':
            return (
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                width={width} height={height} viewBox="0 0 612 612">
                    <path d="M306,243.525c-40.8,0-79.05,7.65-117.3,17.85v79.05c0,10.199-5.1,17.85-15.3,22.949c-25.5,12.75-48.45,28.051-68.85,48.45
                        c-5.1,5.101-10.2,7.65-17.85,7.65c-7.65,0-12.75-2.55-17.85-7.65L5.1,348.075c-2.55-5.1-5.1-10.2-5.1-17.85
                        c0-7.65,2.55-12.75,7.65-17.851c76.5-73.95,183.6-119.85,298.35-119.85s221.85,45.9,298.35,119.85
                        c5.101,5.101,7.65,10.2,7.65,17.851c0,7.649-2.55,12.75-7.65,17.85l-63.75,63.75c-5.1,5.101-10.199,7.65-17.85,7.65
                        s-12.75-2.55-17.85-7.65c-20.4-17.85-43.351-35.7-68.851-48.45c-7.649-5.1-15.3-12.75-15.3-22.949v-79.05
                        C385.05,251.175,346.8,243.525,306,243.525z"
                        fill={fill}
                    />
                </svg>

            )
        case 'microphone':
            return (
                <svg id="Layer_1" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 12 20" width={width} height={height}>
                <path fill={fill} d="M6 11.745a2 2 0 0 0 
                2-2V4.941a2 2 0 0 0-4 0v4.803a2 2 0 0 0 2 
                2.001zm3.495-2.001c0 1.927-1.568 3.495-3.495 
                3.495s-3.495-1.568-3.495-3.495H1.11c0 2.458 
                1.828 4.477 4.192 4.819v2.495h1.395v-2.495c2.364-.342 4.193-2.362 
                4.193-4.82H9.495v.001z" />
                </svg>
            )
        default:
            return;
    }
}