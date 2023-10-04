import { TrackballControls } from '//unpkg.com/three/examples/jsm/controls/TrackballControls.js';
import { CSS2DRenderer } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
Object.assign(THREE , { TrackballControls, CSS2DRenderer });


const markerSvg = `<svg viewBox="-4 0 36 36">
      <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
      <circle fill="black" cx="14" cy="14" r="7"></circle>
    </svg>`;



// Gen random data
const N = 3;
const gData = [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: 7 + Math.random() * 30,
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
}));

const Globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .htmlElementsData(gData)
    .htmlElement(d => {
        const el = document.createElement('div');
        el.innerHTML = markerSvg;
        el.style.color = d.color;
        el.style.width = `${d.size}px`;
        return el;
    });



const globeMaterial = Globe.globeMaterial();
globeMaterial.bumpScale = 10;
new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
    globeMaterial.specularMap = texture;
    globeMaterial.specular = new THREE.Color('grey');
    globeMaterial.shininess = 15;
});



// Setup WebGLRenderer
const globeWebGLRenderer = new THREE.WebGLRenderer(
    {antialias:true, //抗鋸齒
    alpha:true} //抗鋸齒
);
globeWebGLRenderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('globeViz').appendChild(globeWebGLRenderer.domElement);






// Setup scene and lights
const scene = new THREE.Scene();
scene.add(Globe);
scene.add(new THREE.AmbientLight(0xffffff, 6)); // 氛圍燈
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect
scene.add(directionalLight);




// Setup camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
//相機角度
camera.position.z = 240
camera.position.y = 180
camera.position.x = 0



//鼠標控制的的拖拽和伸縮。通過對 camera 的控製實現。
const tbControls = new THREE.TrackballControls(camera, globeWebGLRenderer.domElement);
tbControls.minDistance = 300;
tbControls.maxDistance = 300;
tbControls.rotateSpeed = 5;
// tbControls.zoomSpeed = 0.8;
tbControls.noZoom=true

function animate() { // IIFE

    tbControls.update();
    globeWebGLRenderer.render(scene,camera)
    requestAnimationFrame(animate);

}

animate()