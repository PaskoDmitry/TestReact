// Create a request variable and assign a new XMLHttpRequest object to it.
var countOfImage = 0;
var imageName = '';
var imageTarget;
var items;
var timeoutId;
var request = new XMLHttpRequest();
var requestForItems = new XMLHttpRequest();


// Open a new connection, using the GET request on the URL endpoint
requestForItems.open('GET', 'https://ec-test-react.herokuapp.com/api/v1/items', true);

requestForItems.onload = function () {
    // Begin accessing JSON darequestForItemsta here
    var size = JSON.parse(this.response);
    if (requestForItems.status >= 200 && requestForItems.status < 400) {
        var root = document.getElementById("root");
        root.style.width = size.width*100+'px';
        items = size.width*size.height;
        getImages();
    } else {
        console.log('error');
    }
}
// Send request
requestForItems.send();

function getImages() {
    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'https://ec-test-react.herokuapp.com/api/v1/pictures', true);

    request.onload = function () {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        if(items < 12){
            data = data.splice(0, Math.floor(items/2));
            data = data.concat(data);
        }else{
            data = data.concat(data);
            var countOfMultiplication = Math.floor(items/12);
            var remainder = (items%12)/2;
            var smallArr = data;
            data = replicate(data, countOfMultiplication);
            smallArr = smallArr.splice(0, remainder);
            smallArr = smallArr.concat(smallArr);
            data = data.concat(smallArr);
        }

        if (request.status >= 200 && request.status < 400) {

            data.sort(compareRandom);
            createImage(data);

        } else {
            console.log('error');
        }
    }
// Send request
    request.send();
}


document.addEventListener("click", function (e) {
    if (e.target.className == "back-image" && countOfImage < 2) {
        e.target.style.display = "none";
        e.target.previousSibling.style.display = "";
        countOfImage++;
        if(imageName == e.target.previousSibling.dataset.id) {
            clearTimeout(timeoutId);
            countOfImage = 0;
            imageTarget.style.display = "none";
            e.target.style.display = "none";
            e.target.previousSibling.style.display = "";
            imageTarget.previousSibling.style.display = "";
            imageTarget = 0;
            imageName = '';

        }else{
            imageName = e.target.previousSibling.dataset.id;
            imageTarget = e.target;
            timeoutId = setTimeout(hideFrontImg, 1500, e);
        }
    }
});

function hideFrontImg(e) {

    e.target.style.display = "";
    e.target.previousSibling.style.display = "none";
    if (countOfImage < 2) {
        imageName = '';
        imageTarget = 0;
    }
    countOfImage--;
}

function createImage (data) {
    data.forEach(function(item, i, data) {
        var root =  document.getElementById("root");
        var div  = document.createElement('div');
        div.className = "image";
        div.innerHTML = "<img style='display: none' class='front-image' data-id='" + item +"' src='https://ec-test-react.herokuapp.com/" + item + "'><img class='back-image'  src='img/shirt.jpeg'>";
        root.appendChild(div);

    });
}

function compareRandom(a, b) {
    return Math.random() - 0.5;
}

function replicate(arr, times) {
    for (var parts = []; times > 0; times >>= 1) {
        if (times & 1)
            parts.push(arr);
        arr = arr.concat(arr);
    }
    return Array.prototype.concat.apply([], parts);
}