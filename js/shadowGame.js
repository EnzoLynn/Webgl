$(function() {
    var gstats;
    var guiControlls = {
        clone: '',
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
            color: '#FF0404'
        }
    };
    var sgControll = {
        container: '',
        plane: '',
        scene: '',
        camera: '',
        renderer: '',
        mesh: '',
        vertices: "",
        initStatsUI: function(container) {
            var me = this;
            gstats = new Stats();
            gstats.domElement.style.position = 'absolute';
            gstats.domElement.style.top = '0px';
            me.container.append(gstats.domElement);
        },

        initContainer: function() {
            var me = this,
                ct, scene, camera, renderer;
            me.container = ct = $("#contanier");
            me.scene = scene = new THREE.Scene();
            me.camera = camera = new THREE.PerspectiveCamera(45, ct.width() / ct.height(), 0.1, 1000);
            //摄像机位置
            camera.position.set(-30, 40, 30);
            //camera.lookAt(scene.position);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            me.renderer = renderer = new THREE.WebGLRenderer();
            renderer.setClearColor(0xEEEEEE);
            renderer.setSize(ct.width(), ct.height());
            //设置支持投影
            renderer.shadowMapEnabled = true;
        },

        initPlane: function() {
            var me = this,
                plg;
            var planeGeometry = new THREE.PlaneGeometry(100, 30, 1, 1);
            var planeMaterial = new THREE.MeshBasicMaterial({
                color: 0xf2f2f2
            });
            me.plane = plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.x = 15;
            plane.position.y = 0;
            plane.position.z = 0;
            plane.receiveShadow = true;
            me.scene.add(plane);
        },
        initCustomGeometry: function() {
            var me = this;
            me.vertices = vertices = [new THREE.Vector3(1, 3, 1),
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
                color: '#ffffff'
            });
            // 
            //meshMaterial.wireframe = true;
            me.mesh = mesh = new THREE.Mesh(geometry, meshMaterial);
            mesh.translateY(15);
            mesh.castShadow = true;
            mesh.id = "myobject";

            me.scene.add(mesh);
        },
        initText: function() {
            var me = this,cube;
            var dynamicTexture = new THREEx.DynamicTexture(100, 100);
            //dynamicTexture.context.font = "bold 18px '宋体'";
           // dynamicTexture.texture.anisotropy = me.renderer.getMaxAnisotropy();
            // update the text
            dynamicTexture.clear('cyan')
           //dynamicTexture.drawText('的好', 20, 20, 'red')
            dynamicTexture.drawTextCooked({
                text: '的字',
                font:"bold 18px '宋体'",
                lineHeight: 0.2,
            })

            var geometry = new THREE.BoxGeometry(10, 10, 10);
            var material = new THREE.MeshBasicMaterial({
                map: dynamicTexture.texture
            });
            me.textCube =  cube = new THREE.Mesh(geometry, material);
            me.scene.add(cube);

        },
        cloneCustomGeometry: function() {
            var me = this;
            var cloned = me.mesh.geometry.clone();
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
            var meshMul = THREE.SceneUtils.createMultiMaterialObject(cloned, meshMaterials);
            meshMul.translateX(-15);
            meshMul.translateZ(-15);
            me.scene.add(meshMul);
        },
        initLight: function() {
            var me = this;
            var sc = me.scene,
                ambientLight, pointLight, spotLight, directionalLight, hemiLight;

            //环境光
            me.ambientLight = ambientLight = new THREE.AmbientLight('#0c0c0c');
            sc.add(ambientLight);
            //点光源
            me.pointLight = pointLight = new THREE.PointLight('#ccffcc');
            pointLight.distance = 100;
            //pointLight.visible = true;
            sc.add(pointLight);
            //聚光灯
            var spotLightColor = '#FF0404';
            me.spotLight = spotLight = new THREE.SpotLight(spotLightColor);
            spotLight.position.set(-10, 200, 71);
            spotLight.castShadow = true;
            spotLight.target = me.plane;
            //spotLight.shadowCameraVisible = true;
            sc.add(spotLight);
            spotLight.shadowCameraNear = 50;
            spotLight.shadowCameraFar = 300;
            spotLight.shadowCameraFov = 30;
            // var cubeShadow = new THREE.ShadowMesh(cube1);
            // scene.add(cubeShadow);
            //方向光
            var directionalLightColor = '#0043FF';
            me.directionalLight = directionalLight = new THREE.DirectionalLight(directionalLightColor);
            directionalLight.position.set(-30, 10, -10);
            directionalLight.castShadow = true;
            directionalLight.target = me.plane;
            //directionalLight.shadowCameraVisible = true;
            sc.add(directionalLight);
            directionalLight.shadowCameraNear = 50;
            directionalLight.shadowCameraFar = 300;
            directionalLight.shadowCameraFov = 30;
            //半球光
            me.hemiLight = hemiLight = new THREE.HemisphereLight('#0000ff', '#00ff00', 0.6);
            //hemiLight.position.set(0, 500, 0);
            sc.add(hemiLight);
        },
        initController: function() {
            //https://about.gitlab.com/downloads/
            var me = this;
            var gui = new dat.GUI();
            for (var i = 0; i < me.vertices.length; i++) {
                var tempv = gui.addFolder('Vertice' + i);

                tempv.add(me.vertices[i], 'x', 1, 10);
                tempv.add(me.vertices[i], 'y', 1, 10);
                tempv.add(me.vertices[i], 'z', 1, 10);
            };
            //guiControlls.clone = me.cloneCustomGeometry;
            var controlls = guiControlls;
            //gui.add(controlls, 'clone', "!#复制");
            var tempv = gui.addFolder('旋转控制');
            tempv.add(controlls.rotation, 'x', 0.5 * Math.PI, 2 * Math.PI, "!#旋转x");
            tempv.add(controlls.rotation, 'y', 0.5 * Math.PI, 2 * Math.PI, "!#旋转y");
            tempv.add(controlls.rotation, 'z', 0.5 * Math.PI, 2 * Math.PI, "!#旋转z");
            gui.add(controlls, 'ambientLightColor', "!#环境光").onChange(function(e) {
                me.ambientLight.color = new THREE.Color(e);
            });
            var tempv = gui.addFolder('点光源控制');
            tempv.closed = false;
            tempv.add(controlls.pointLight, 'color', "!#颜色").onChange(function(e) {
                me.pointLight.color = new THREE.Color(e);
            });
            tempv.add(controlls.pointLight, 'distance', 0, 200, "!#距离").onChange(function(e) {
                me.pointLight.distance = e;
            });
            tempv.add(controlls.pointLight, 'intensity', 0, 10, "!#强度").onChange(function(e) {
                me.pointLight.intensity = e;
            });
        },
        initAxes: function() {
            var me = this;
            //坐标体系辅助
            var axes = new THREE.AxisHelper(20);
            me.scene.add(axes);
        },
        play: function() {
            var me = this;
            me.container.append(me.renderer.domElement);
            me.renderer.render(me.scene, me.camera);
        }
    }
    sgControll.initContainer();
    sgControll.initStatsUI();
    sgControll.initPlane();
    sgControll.initLight();
    sgControll.initAxes();
    sgControll.initCustomGeometry();
    sgControll.initText();
    sgControll.initController();

    sgControll.play();

    var render = function() {
            gstats.update();

            requestAnimationFrame(render);
            sgControll.mesh.geometry.vertices = sgControll.vertices;
            sgControll.mesh.geometry.verticesNeedUpdate = true;
            sgControll.mesh.geometry.computeFaceNormals();
            sgControll.textCube.rotation.y += 0.5;
            sgControll.mesh.rotation.x = guiControlls.rotation.x;
            sgControll.mesh.rotation.y = guiControlls.rotation.y;
            sgControll.mesh.rotation.z = guiControlls.rotation.z;
            sgControll.renderer.render(sgControll.scene, sgControll.camera);
        }
        render();



});
