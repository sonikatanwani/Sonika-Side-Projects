var currentSelectedMovieID = null;

var camera, scene, renderer;
var controls;

var objects = [];
var targets = {table: [], sphere: [], helix: [], grid: []};

init();
animate();

function init() {

    //aspect ratio based on windows width and height
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1800;

    scene = new THREE.Scene();

    // table

    for (var i = 0; i < data.length; i++) {
        if (i == data.length) break;


        var element = document.createElement('div');
        element.setAttribute("id", data[i].id);
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
        if (i == 0) {
            currentSelectedMovieID = data[i].id;
            element.classList.add("selected");
            element.focus();
        }

        var img = document.createElement('img');
        img.src = data[i].movie.poster;
        img.height = 250;
        img.width = 180;
        element.appendChild(img);

        var object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);

        objects.push(object);

        var object = new THREE.Object3D();
        object.position.x = (data[i].col * 195) - 1275;
        object.position.y = -(data[i].row * 150) + 900;

        targets.table.push(object);

    }

    // sphere

    var vector = new THREE.Vector3();

    for (var i = 0, l = objects.length; i < l; i++) {

        var phi = Math.acos(-1 + (2 * i) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var object = new THREE.Object3D();

        object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
        object.position.y = 800 * Math.sin(theta) * Math.sin(phi);
        object.position.z = 800 * Math.cos(phi);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        targets.sphere.push(object);

    }

    // helix

    var vector = new THREE.Vector3();

    for (var i = 0, l = objects.length; i < l; i++) {

        var phi = i * 0.175 + Math.PI;

        var object = new THREE.Object3D();

        object.position.x = 900 * Math.sin(phi);
        object.position.y = -(i * 8) + 450;
        object.position.z = 900 * Math.cos(phi);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        targets.helix.push(object);

    }

    // grid

    for (var i = 0; i < objects.length; i++) {

        var object = new THREE.Object3D();

        object.position.x = ((i % 5) * 400) - 800;
        object.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
        object.position.z = (Math.floor(i / 25)) * 1000 - 2000;

        targets.grid.push(object);

    }

    //

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'relative';
    //renderer.domElement.style.backgroundColor = 'red';
    renderer.domElement.setAttribute("id", "frame");
    //renderer.domElement.firstElementChild.classList.add("selected");

    $("#container").append(renderer.domElement);


    var postersPerRow = 12;

    //handle key event to navigate between posters
    $("body").on("keydown", function (event) {

        var selectedPoster = $(".selected");

        if (selectedPoster.length == 0) return;

        var key = event.keyCode || event.which;

        if (key == "13") {
            for (var j = 0; j < data.length; j++)
                if (data[j].id == selectedPoster[0].id) {
                    currentSelectedMovieID = data[j].id;
                    window.location.href = 'selectedmovie.html?movieId=' + currentSelectedMovieID;
                    break;
                }
        }

        var index = parseInt(selectedPoster[0].id.split('_')[1]);

        var newPoster = null;

        if (key === 37) { //left
            newPoster = $("#movie_" + (index - 1));
        }
        else if (key === 39) { //right
            newPoster = $("#movie_" + (index + 1));
        }
        else if (key === 38) { //up
            newPoster = $("#movie_" + (index - postersPerRow));
        }
        else if (key === 40) { //down
            newPoster = $("#movie_" + (index + postersPerRow));
        }
        if (newPoster !== null) {
            currentSelectedMovieID = newPoster[0].id;
            selectedPoster.removeClass("selected");
            newPoster.addClass("selected");
        }
    });


    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.addEventListener('change', render);

    $("#table").on('click', function (event) {
        transform(targets.table, 2000);
    });

    $("#sphere").on('click', function (event) {
        transform(targets.sphere, 2000);
    });

    $("#helix").on('click', function (event) {
        transform(targets.helix, 2000);
    });

    $("#grid").on('click', function (event) {
        transform(targets.grid, 2000);
    });

    transform(targets.table, 2000);

    //to zoom the elements on resize of window
    window.addEventListener('resize', onWindowResize, false);
}

function transform(targets, duration) {

    TWEEN.removeAll();

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
            .to({x: target.position.x, y: target.position.y, z: target.position.z}, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z}, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

}

function onWindowResize() {


    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    camera.position.z = 3000 / camera.aspect;

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function animate() {

    camera.position.z = 3500 / camera.aspect;

    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();


}

function render() {

    renderer.render(scene, camera);

}

