import { TrackballControls } from '//unpkg.com/three/examples/jsm/controls/TrackballControls.js';
import { CSS2DRenderer } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
Object.assign(THREE , { TrackballControls, CSS2DRenderer });
// import CustomTip from "./js/customTip.js";


const markerSvg = `<svg viewBox="-4 0 36 36">
      <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
      <circle fill="black" cx="14" cy="14" r="7"></circle>
    </svg>`;



const N = 3;
const gData = [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: 7 + Math.random() * 30,
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
}));




const Globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .htmlElementsData(gData)
    .htmlElement(d => {
        const el = document.createElement('div');
        el.innerHTML = markerSvg;
        el.style.color = d.color;
        el.style.width = `${d.size}px`;
        return el;
    });

// custom globe material
const globeMaterial = Globe.globeMaterial();
globeMaterial.bumpScale = 10;
new THREE.TextureLoader().load('//unpkg.com/three-globe/example/img/earth-water.png', texture => {
    globeMaterial.specularMap = texture;
    globeMaterial.specular = new THREE.Color('grey');
    globeMaterial.shininess = 15;
});

//射燈
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect

// // Setup WebGLRenderer
// const globeWebGLRenderer = new THREE.WebGLRenderer(
//     {antialias:true, //抗鋸齒
//     alpha:true} //抗鋸齒
// );
// globeWebGLRenderer.setSize(window.innerWidth, window.innerHeight);
// globeWebGLRenderer.setClearColor (0xffffff, 1); //宇宙背景
// document.getElementById('globeViz').appendChild(globeWebGLRenderer.domElement);
//
//
//
// // Setup CSS2DRenderer
// const markerCss2DRenderer=new THREE.CSS2DRenderer();
// markerCss2DRenderer.setSize(window.innerWidth, window.innerHeight);
// markerCss2DRenderer.domElement.style.position = 'absolute';
// markerCss2DRenderer.domElement.style.top = '0px';
// markerCss2DRenderer.domElement.style.pointerEvents = 'none';
// document.getElementById('globeViz').appendChild(markerCss2DRenderer.domElement);

const renderers = [new THREE.WebGLRenderer(), new THREE.CSS2DRenderer()];
renderers.forEach((r, idx) => {
    r.setSize(window.innerWidth, window.innerHeight);
    if (idx > 0) {
        // overlay additional on top of main renderer
        r.domElement.style.position = 'absolute';
        r.domElement.style.top = '0px';
        r.domElement.style.pointerEvents = 'none';
    }
    document.getElementById('globeViz').appendChild(r.domElement);
});
renderers[0].setClearColor (0xffffff, 1)

// Setup scene
const scene = new THREE.Scene();
scene.add(Globe);
scene.add(new THREE.AmbientLight(0xffffff, 6)); // 氛圍燈
scene.add(directionalLight);



// Setup camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
//相機角度
camera.position.z = 240;
camera.position.y=180;//
camera.position.x=0;//

//鼠標控制的的拖拽和伸縮。通過對 camera 的控製實現。
// Add camera controls
const tbControls = new THREE.TrackballControls(camera, renderers[0].domElement);
tbControls.minDistance = 300;//300
tbControls.maxDistance = 300;//300
tbControls.noZoom=true;
tbControls.rotateSpeed = 5;
// tbControls.zoomSpeed = 0.8;



// Update pov when camera moves. 主要為了在鼠標拖轉(即移動鏡頭)的時候，決定哪些marker 需要顯示，哪些marker 需要隱藏。
Globe.setPointOfView(camera.position, Globe.position);
tbControls.addEventListener('change', () => Globe.setPointOfView(camera.position, Globe.position));



//窗口伸縮

// function onWindowResize(){
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     globeWebGLRenderer.setSize( window.innerWidth, window.innerHeight );
// }
// window.addEventListener( 'resize', onWindowResize, false );
//





//判斷鼠標是否在地球上
// const raycaster = new THREE.Raycaster();
// const pointer = new THREE.Vector2();
// function onPointerMove( event ) {
//
//     // calculate pointer position in normalized device coordinates
//     // (-1 to +1) for both components
//
//     pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//
// }
// window.addEventListener( 'pointermove', onPointerMove );
// //旋轉地球自身。
// function rotateGlobe(){
//
//
//     raycaster.setFromCamera( pointer, camera );
//     // calculate objects intersecting the picking ray
//     const intersects = raycaster.intersectObjects( scene.children );
//     // console.log(intersects.length)
//     if (intersects.length===0) { //如果沒有鼠標在地球上
//         // Globe.rotateY(0.005)
//     }
// }
//



function animate() { // IIFE
    // Frame cycle

    // rotateGlobe();
    tbControls.update();
    // globeWebGLRenderer.render(scene, camera);
    // markerCss2DRenderer.render(scene, camera);
    renderers.forEach(r => r.render(scene, camera));

    // console.log("Position", camera.position)
    // console.log("Rotation", camera.rotation)

    requestAnimationFrame(animate);

}

animate()

