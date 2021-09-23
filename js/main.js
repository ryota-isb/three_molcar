import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';

window.addEventListener('load', init);

function init() {
    // サイズを指定
    const width = 960;
    const height = 540;
    let rot = 0;

    const canvasElement = document.querySelector('#myCanvas')

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasElement,
    });
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    // カメラの初期座標を設定
    camera.position.set(0, 500, 1000);

    // カメラコントローラーを作成
    const controls = new OrbitControls(camera, canvasElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    // 環境光源
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.5);
    directionalLight.position.set(-5, 10, -5);
    scene.add(directionalLight);

    // モデルを読み込み
    const loader = new GLTFLoader();
    const url = 'glb/poteto.glb'

    let model = null;

    loader.load(url, function (gltf) {
        model = gltf.scene;
        model.scale.set(400.0, 400.0, 400.0);
        model.position.set(0, -100, 0);
        scene.add(gltf.scene);
    });

    // 星屑を作成
    createStarField();

    /** 星屑を作成 */
    function createStarField() {
        // 頂点情報を作成
        const verticles = [];
        for (let i = 0; i < 1000; i++) {
            const x = 3000 * (Math.random() - 0.5);
            const y = 3000 * (Math.random() - 0.5);
            const z = 3000 * (Math.random() - 0.5);

            verticles.push(x, y, z);
        }

        // 形状データを作成
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(verticles, 3));

        // マテリアルを作成
        const material = new THREE.PointsMaterial({
            size: 10,
            color: 0xffffff,
        });

        // 物体を作成
        const mesh = new THREE.Points(geometry, material);
        scene.add(mesh);
    }

    tick();

    // 毎フレーム時に実行されるループイベントです
    function tick() {
        rot += 0.5; // 毎フレーム角度を0.5度ずつ足していく
        // ラジアンに変換する
        const radian = (rot * Math.PI) / 180;
        // 角度に応じてカメラの位置を設定
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        // 原点方向を見つめる
        camera.lookAt(new THREE.Vector3(0, 0, 0))

        // レンダリング
        renderer.render(scene, camera);

        requestAnimationFrame(tick);
    }
}