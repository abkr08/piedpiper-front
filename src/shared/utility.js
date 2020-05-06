import React from 'react';
import moment from 'moment';

import { endCall } from '../store/actions/actionIndex';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const formatDate = date => {
    moment.updateLocale('en', {
        calendar : {
            lastDay : '[Yesterday]',
            sameDay : 'LT',
            nextDay : '[Tomorrow at] LT',
            lastWeek : 'dddd',
            nextWeek : 'dddd [at] LT',
            sameElse : 'L'
        }
    });
    return moment(date).calendar()
}

export const formatTime = date => {
    let timedifference = new Date().getTimezoneOffset();

    return moment.utc(date).utcOffset(timedifference * -1).format('hh:mm');
}

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
        case 'phone':
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16">
                    <path fill={fill} d="M15.897 9c0.125 0.867 0.207 2.053-0.182 2.507-0.643 0.751-4.714 0.751-4.714-0.751 0-0.756 0.67-1.252 0.027-2.003-0.632-0.738-1.766-0.75-3.027-0.751s-2.394 0.012-3.027 0.751c-0.643 0.751 0.027 1.247 0.027 2.003 0 1.501-4.071 1.501-4.714 0.751-0.389-0.454-0.307-1.64-0.182-2.507 0.096-0.579 0.339-1.203 1.118-2 0-0 0-0 0-0 1.168-1.090 2.935-1.98 6.716-2v-0c0.021 0 0.042 0 0.063 0s0.041-0 0.063-0v0c3.781 0.019 5.548 0.91 6.716 2 0 0 0 0 0 0 0.778 0.797 1.022 1.421 1.118 2z"></path>
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
        case 'checkmark':
            return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width={width} height={height}><path fill={fill} d="M9.9 21.25l-6.7-6.7-2.2 2.2 8.9 8.9L29 6.55l-2.2-2.2-16.9 16.9z"></path></svg>
        case 'reselect':
            return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height}><path fill={fill} d="M19.77 11.73c0 1.64-.5 2.95-1.48 3.89-1.38 1.32-3.26 1.41-3.75 1.41H9.01v-2.1h5.46c.05 0 1.47.04 2.38-.84.55-.53.82-1.32.82-2.37 0-1.27-.33-2.23-.99-2.84-.98-.92-2.43-.85-2.44-.85h-4.23v3.1L4 7.07 10.01 3v2.93h4.16c.03 0 2.29-.13 3.95 1.42 1.09 1.03 1.65 2.5 1.65 4.38z"></path></svg>
        case 'close':
            return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height}><path fill={fill} d="M19.058 17.236l-5.293-5.293 5.293-5.293-1.764-1.764L12 10.178 6.707 4.885 4.942 6.649l5.293 5.293-5.293 5.293L6.707 19 12 13.707 17.293 19l1.765-1.764z"></path></svg>
        case 'plus':
            return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width={width} height={height}><path fill={fill} d="M19.619 14.803h-4.816v4.816h-1.605v-4.816H8.381v-1.605h4.816V8.381h1.605v4.816h4.816l.001 1.606z"></path></svg>
        case 'minus':
            return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width={width} height={height}><path fill={fill} d="M8.381 14.803v-1.605h11.237v1.605H8.381z"></path></svg>  
        default:
            return;
    }
}