$(function() {

    var contanier = $("#contanier");
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, contanier.width() / contanier.height(), 0.1, 1000);
    //摄像机位置
    camera.position.set(-30, 40, 30);
    //camera.lookAt(scene.position);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(contanier.width(), contanier.height());
    //设置支持投影
    renderer.shadowMapEnabled = true;

    //设置投影4步
    //设置渲染器renderer.shadowMapEnabled = true;
    //设置接受容器plane.receiveShadow= true;
    //设置物体网格cube.castShadow = true;
    //设置灯光spotLight.castShadow = true;


    var planceGeometry = new THREE.PlaneGeometry(100, 30, 1, 1);
    //console.log(planceGeometry.parameters.width);
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xf2f2f2
    });
    var plane = new THREE.Mesh(planceGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    var vertices = [new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ];

    var faces = [new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4)
    ];

    var geometry = new THREE.Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;


    //geometry.computeFaceNormals();
    //geometry.computeVertexNormals();
    //geometry.mergeVertices();
    //geometry.computeBoundingSphere();
    var meshMaterial = new THREE.MeshLambertMaterial({
        color: 0x123ff2
    });
    // 
    var meshMaterials = [
        new THREE.MeshLambertMaterial({
            opacity: 0.6,
            color: 0xff44ff,
            transparent: true
        }),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true
        })
    ];
    var mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.translateY(15); 
    mesh.castShadow = true;
    mesh.id= "myobject";
    var cloned = mesh.geometry.clone();
    var meshMul = THREE.SceneUtils.createMultiMaterialObject(cloned, meshMaterials);
    scene.add(mesh);
    meshMul.translateX(-15);
    meshMul.translateZ(-15);   
    scene.add(meshMul);


    //
    var cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: '#1FCAED'
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.name = "cube-" + scene.children.length;
    cube.position.x = 3;
    cube.position.y = 13;
    cube.position.z = 13;
    cube.castShadow = true;
    scene.add(cube);
    // var cubeShadow = new THREE.ShadowMesh(cube);
    // scene.add(cubeShadow);
    var cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    var cubeMaterial = new THREE.MeshLambertMaterial({
        color: '#ffffff'
    });
    var cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube1.name = "cube-" + scene.children.length;
    cube1.position.x = -13;
    cube1.position.y = 13;
    cube1.position.z = -3;
    cube1.castShadow = true;
    scene.add(cube1);
    //坐标体系辅助
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    //环境光
    var ambientLight = new THREE.AmbientLight('#0c0c0c');
    scene.add(ambientLight);
    //点光源
    var pointLight = new THREE.PointLight('#ccffcc');
    pointLight.distance = 100;
    //pointLight.visible = true;
    scene.add(pointLight);
    //聚光灯
    var spotLightColor = '#FF0404';
    var spotLight = new THREE.SpotLight(spotLightColor);
    spotLight.position.set(-10, 200,71);
    spotLight.castShadow = true;
    spotLight.target = plane;
    //spotLight.shadowCameraVisible = true;
    scene.add(spotLight);
    spotLight.shadowCameraNear = 50;
    spotLight.shadowCameraFar = 300;
    spotLight.shadowCameraFov = 30;
    // var cubeShadow = new THREE.ShadowMesh(cube1);
    // scene.add(cubeShadow);
     //方向光
    var directionalLightColor = '#0043FF';
    var directionalLight = new THREE.DirectionalLight(directionalLightColor);
    directionalLight.position.set(-30, 10, -10);
    directionalLight.castShadow = true;
    directionalLight.target = plane;
    //directionalLight.shadowCameraVisible = true;
    scene.add(directionalLight);
    directionalLight.shadowCameraNear = 50;
    directionalLight.shadowCameraFar = 300;
    directionalLight.shadowCameraFov = 30;
    //半球光
    var hemiLight = new THREE.HemisphereLight('#0000ff','#00ff00',0.6);
    hemiLight.position.set(0,500,0);
    scene.add(hemiLight);

    //添加clone
    var controlls = {
        clone: function() {
            var cloned = mesh.geometry.clone();
            var materials = [
                new THREE.MeshLambertMaterial({
                    opacity: 0.6,
                    color: 0xff44ff,
                    transparent: true
                }),
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    wireframe: true
                })
            ];
            var mesh2 = THREE.SceneUtils.createMultiMaterialObject(cloned, materials);
            mesh2.children.forEach(function(e) {
                e.castShadow = true;
            });
            mesh2.translateX(5);
            mesh2.translateZ(5);
            mesh2.name = "clone";
            scene.remove(scene.getChildByName("clone"));
            scene.add(mesh2);
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        ambientLightColor: '#0c0c0c',
        pointLight: {
            color: '#ccffcc',
            distance: 100,
            intensity: 1
        },
        spotLight: {
            color: spotLightColor 
        }
    };


    //添加帧
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    contanier.append(stats.domElement);

    //添加控制
    var gui = new dat.GUI();
    for (var i = 0; i < vertices.length; i++) {
        var tempv = gui.addFolder('Vertice' + i);

        tempv.add(vertices[i], 'x', 1, 10);
        tempv.add(vertices[i], 'y', 1, 10);
        tempv.add(vertices[i], 'z', 1, 10);
    };
    gui.add(controlls, 'clone', "!#复制");
    var tempv = gui.addFolder('旋转控制');
    tempv.add(controlls.rotation, 'x', 0.5 * Math.PI, 2 * Math.PI, "!#旋转x");
    tempv.add(controlls.rotation, 'y', 0.5 * Math.PI, 2 * Math.PI, "!#旋转y");
    tempv.add(controlls.rotation, 'z', 0.5 * Math.PI, 2 * Math.PI, "!#旋转z");
    gui.add(controlls, 'ambientLightColor', "!#环境光").onChange(function(e) {
        ambientLight.color = new THREE.Color(e);
    });
    var tempv = gui.addFolder('点光源控制');
    tempv.closed = false;
    tempv.add(controlls.pointLight, 'color', "!#颜色").onChange(function(e) {
        pointLight.color = new THREE.Color(e);
    });
    tempv.add(controlls.pointLight, 'distance', 0, 200, "!#距离").onChange(function(e) {
        pointLight.distance = e;
    });
    tempv.add(controlls.pointLight, 'intensity', 0, 10, "!#强度").onChange(function(e) {
        pointLight.intensity = e;
    });





    contanier.append(renderer.domElement);
    renderer.render(scene, camera);

    function render() {
        stats.update();
        requestAnimationFrame(render);
        mesh.geometry.vertices = vertices;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.computeFaceNormals();
        mesh.rotation.x = controlls.rotation.x;
        mesh.rotation.y = controlls.rotation.y;
        mesh.rotation.z = controlls.rotation.z;
        renderer.render(scene, camera);
    }
    render();

});
