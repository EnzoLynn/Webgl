$(function() {




    var scene = new THREE.Scene();
    var contanier = $("#contanier");
    var camera = new THREE.PerspectiveCamera(45, contanier.width() / contanier.height(), 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(contanier.width(), contanier.height());

    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    contanier.append(stats.domElement);




    //坐标体系辅助
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    // var geometry = new THREE.BoxGeometry(1, 1, 1);
    //        var material = new THREE.MeshBasicMaterial({
    //            color: 0x00ff00
    //        });

    //        var cube = new THREE.Mesh(geometry, material);
    //        scene.add(cube);


    var planceGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    //console.log(planceGeometry.parameters.width);
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc
    });
    var plane = new THREE.Mesh(planceGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var type = {
        '随机': "random",
        '方形': "cube",
        '球形': "sphere",

    };
    var controls = new function() {
        this.rotationSpeed = 0.02;
        this.scene = scene;
        this.planceGeometry = planceGeometry.parameters;
        this.delType = "random";
        /**
         * 添加方形
         */
        this.addCube = function() {
            var me = this,
                scene = me.scene,
                planceGeometry = me.planceGeometry;

            var cubeSize = Math.ceil((Math.random() * 3));

            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;
            cube.position.x = -30 + Math.round((Math.random() * planceGeometry.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planceGeometry.height));
            console.log(cube);
            scene.add(cube);
            me.numberOfObjects = scene.children.length;
        };
        /**
         * 添加球形
         */
        this.addSphere = function() {
            var me = this,
                scene = me.scene,
                planceGeometry = me.planceGeometry;

            var cubeSize = Math.ceil((Math.random() * 3));

            var cubeGeometry = new THREE.SphereGeometry(cubeSize, 32, 32);
            var cubeMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() * 0xffffff
            });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.castShadow = true;
            cube.name = "sphere-" + scene.children.length;

            cube.position.x = -30 + Math.round((Math.random() * planceGeometry.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planceGeometry.height));
            console.log(cube);
            scene.add(cube);
            me.numberOfObjects = scene.children.length;
        };
        /**
         * 删除物体
         */
        this.removeObject = function() {
            var me = this,
                scene = me.scene,
                type = me.delType; 
            var allChildren = scene.children;
            for (var i = allChildren.length - 1; i >= 0; i--) {
                var temp = allChildren[i]; 
                if (temp instanceof THREE.Mesh && temp != plane) { 
                    if (type == "cube") {
                        if (temp.geometry instanceof THREE.BoxGeometry) {
                            scene.remove(temp);
                            me.numberOfObjects = scene.children.length;
                            return false;
                        } else {
                            continue;
                        }
                    } else if (type == "sphere") {
                        if (temp.geometry instanceof THREE.SphereGeometry) {
                            scene.remove(temp);
                            me.numberOfObjects = scene.children.length;
                            return false;
                        } else {
                            continue;
                        }
                    } else {
                        scene.remove(temp);
                        me.numberOfObjects = scene.children.length;
                        return false;
                    }
                };


            };
            // var lastObject = allChildren[allChildren.length - 1];
            // if (lastObject instanceof THREE.Mesh) {
            //     scene.remove(lastObject);
            //     me.numberOfObjects = scene.children.length;
            // };
        };
        /**
         * 输出物体信息
         */
        this.outputObject = function() {
            var me = this,
                scene = me.scene;

            console.log(scene.children);
        };
    };
    gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed',0, 0.5,"!#速度");
    gui.add(controls, 'addCube',"!#添加方形");
    gui.add(controls, 'addSphere',"!#添加球形"); 
    gui.add(controls, 'delType', type,"!#删除类型").onChange(function(value) {
        controls.delType = value;
        //controls.removeObject();
    });
    gui.add(controls, 'removeObject',"!#删除物体");
    gui.add(controls, 'outputObject',"!#输出物体信息");
    // controls.init(scene,planceGeometry);
    // controls.addCube();

    //环境光
    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    //聚光灯
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 1000, 100);
    scene.add(spotLight);
    //点光源
    var light = new THREE.PointLight(0x00FF00);
    light.position.set(0, 0, 300);
    scene.add(light);

    //雾化
    scene.fog = new THREE.FogExp2(0xffffff, 0.015, 100);

    //摄像机位置
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    contanier.append(renderer.domElement);
    renderer.render(scene, camera);
    // for (var i = 0; i < 2000; i++) {
    // 	controls.addCube();
    // };
    function render() {
        stats.update();
        scene.traverse(function(e) {
            if (e instanceof THREE.Mesh && e != plane) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;

            };
        });
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    render();
});
