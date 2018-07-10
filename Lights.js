const LIGHTS = [{
    lightsPosition: [-87.05, 41.7, 8000.0],
    lightsStrength: [2.0, 0.0],
}, {
    lightsPosition: [-86.5, 40.0, 5000.0],
    lightsStrength: [0.0, 2.0],
}];

const LIGHT_SETTINGS = {
    lightsPosition: LIGHTS.reduce((acc, light) => [...acc, ...light.lightsPosition], []),
    ambientRatio: 0.05,
    diffuseRatio: 0.6,
    specularRatio: 0.8,
    lightsStrength: LIGHTS.reduce((acc, light) => [...acc, ...light.lightsStrength], []),
    numberOfLights: LIGHTS.length, // max is 5
};

export { LIGHT_SETTINGS };