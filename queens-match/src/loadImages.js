// src/utils/loadImages.js
const importAll = (r) => {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
};

const images = importAll(require.context('./assets/Avatars', false, /\.(png|jpe?g|svg)$/));

export default images;
