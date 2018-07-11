const Lights = [{
    lightsPosition: [-87.05, 41.7, 8000.0],
    lightsStrength: [1.0, 0.0],
}, {
    lightsPosition: [-86.5, -40.0, 5000.0],
    lightsStrength: [2.0, 0.0],
}];

const LIGHT_SETTINGS = {
    lightsPosition: Lights.reduce((acc, light) => [...acc, ...light.lightsPosition], []),
    ambientRatio: 0.15,
    diffuseRatio: 0.6,
    specularRatio: 0.7,
    lightsStrength: Lights.reduce((acc, light) => [...acc, ...light.lightsStrength], []),
    numberOfLights: Lights.length, // max is 5
};

export { LIGHT_SETTINGS };