import { TrackballControls } from '//unpkg.com/three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from '//unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from '//unpkg.com/three/examples/jsm/renderers/CSS2DRenderer.js';
Object.assign(THREE , { TrackballControls, CSS2DRenderer, OrbitControls });
import {datapoints,markerSvg} from "./for_markers_dev2.js";
import {getOffsetAgainstPage} from "./util.js";


const Globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .htmlElementsData(datapoints)
    .htmlElement(datapoint => {
        return datapoint.toElement();
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


// Setup CSS2DRenderer
const markerCss2DRenderer=new THREE.CSS2DRenderer();
markerCss2DRenderer.setSize(window.innerWidth, window.innerHeight);
markerCss2DRenderer.domElement.style.position = 'absolute';
markerCss2DRenderer.domElement.style.top = '0px';
markerCss2DRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('globeViz').appendChild(markerCss2DRenderer.domElement);


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
// const tbControls = new THREE.TrackballControls(camera, globeWebGLRenderer.domElement);
// tbControls.minDistance = 300;
// tbControls.maxDistance = 300;
// tbControls.rotateSpeed = 3;
// // tbControls.zoomSpeed = 0.8;
// tbControls.noZoom=true;




const orbitControls = new THREE.OrbitControls(camera, globeWebGLRenderer.domElement);
orbitControls.autoRotate=true
orbitControls.minDistance = 300;
orbitControls.maxDistance = 300;
orbitControls.rotateSpeed = 1;
// tbControls.zoomSpeed = 0.8;
orbitControls.enableZoom=false;
orbitControls.enableDamping=true;//惯性效果


//窗口伸縮
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    globeWebGLRenderer.setSize( window.innerWidth, window.innerHeight );
    markerCss2DRenderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener( 'resize', onWindowResize, false );




// 判斷鼠標是否在地球上
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerMove( event ) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    let canvasElement=document.getElementsByTagName("canvas");
    pointer.y = - ( (event.pageY-getOffsetAgainstPage(globeWebGLRenderer.domElement).top) / window.innerHeight ) * 2 + 1;

    // console.log(event.clientY,event.pageY, pointer.y)


}
window.addEventListener( 'pointermove', onPointerMove );
//旋轉地球自身。
function mouseOnGlobe(){


    raycaster.setFromCamera( pointer, camera );
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children );
    // console.log(intersects.length)

    // for ( let i = 0; i < intersects.length; i ++ ) {
    //
    //     console.log(intersects[ i ])
    //
    // }



    if (intersects.length===0) { //如果沒有鼠標在地球上
        return false;
    }else{
        return true;
    }

}





// Update pov when camera moves. 主要為了在鼠標拖轉(即移動鏡頭)的時候，決定哪些marker 需要顯示，哪些marker 需要隱藏。
Globe.setPointOfView(camera.position, Globe.position);
// tbControls.addEventListener('change', () => Globe.setPointOfView(camera.position, Globe.position));
orbitControls.addEventListener('change', () => Globe.setPointOfView(camera.position, Globe.position));


function animate() { // IIFE

    // tbControls.update();

    orbitControls.autoRotate=!mouseOnGlobe()



    orbitControls.update();
    globeWebGLRenderer.render(scene, camera);
    markerCss2DRenderer.render(scene, camera);
    requestAnimationFrame(animate);

}

animate()