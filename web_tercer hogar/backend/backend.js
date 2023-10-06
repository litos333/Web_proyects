window.addEventListener('load', () => {
    const image = document.getElementById('imagePreview');
    const imageTitle = document.getElementById('imageTitle');
    const fileInput = document.getElementById('file');
    const fileInputAbout = document.getElementById('fileAbout');
    const imageAbout = document.getElementById('imagePreviewAbout');
    const imageTitleAbout = document.getElementById('imageTitleAbout');
    const clearButton = document.getElementById('clearButton');
    const clearButtonAbout = document.getElementById('clearButtonAbout');
    const navItems = document.getElementsByClassName('sidebar')[0].children;
    
   
    displayNewsOnLoad();

    fileInput.addEventListener('change', () => {
        var imageData = fileInput.files[0];
        image.innerHTML = `<img id="imagePreview" src="${URL.createObjectURL(imageData)}">`;
        imageTitle.innerHTML = imageData.name
    })

    clearButton.addEventListener('click', () => {
        image.innerHTML = "";
        imageTitle.innerHTML = "Image";
    })

    fileInputAbout.addEventListener('change', () => {
        var imageData = fileInputAbout.files[0];
        imageAbout.innerHTML = `<img id="imagePreview" src="${URL.createObjectURL(imageData)}">`;
        imageTitleAbout.innerHTML = imageData.name
    })

    clearButtonAbout.addEventListener('click', () => {
        imageAbout.innerHTML = "";
        imageTitleAbout.innerHTML = "Image";
    })

    for(let i = 0; i < navItems.length - 1; i++){
        navItems[i].addEventListener('click', () => {
            changeForm(i)
        });
    }
    
})

var currentForm = 1;

// Get query string parameters value
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Initialize the App Client
const client = stitch.Stitch.initializeDefaultAppClient("easdib-sjo-tvens");
// Get a MongoDB Service Client
const mongodb = client.getServiceClient(
    stitch.RemoteMongoClient.factory,
    "mongodb-atlas"
);

// Get a reference to the music database
const db = mongodb.db("EASDIB-SJO");

function displayNews() {
    db.collection("news")
    .find()
    .toArray()
        .then(docs => {
            // console.log(docs)
            var html = "";
            for (j = 0; j < docs.length; j++) {
                var result = `
                    <div>
                        <h2>Title: ${docs[j].title}</h2>
                        <h3>Subtitle: ${docs[j].subtitle}</h3>
                        <p>New content: ${docs[j].content}</p>
                        <span>date: ${docs[j].date}</span><br>
                        <span>Extern Url: ${docs[j].url}</span><br>
                        <span>Image: </span><span>${docs[j].image}</span> - 
                        <svg id="previewEye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg><br>
                        <button onclick="deleteNews('${docs[j]._id}')">DELETE</button>
                    </div>
                    <hr>
                `;
                html = html + result;

            }
            document.getElementById("form3").innerHTML = html;
            loadPreviewImage()
    })

}

function displayAbout() {
    db.collection("about")
    .find()
    .toArray()
        .then(docs => {
            // console.log(docs)
            var html = "";
            for (j = 0; j < docs.length; j++) {
                var result = `
                    <div>
                        <h2>Title: ${docs[j].title}</h2>
                        <h3>Subtitle: ${docs[j].subtitle}</h3>
                        <p>content: ${docs[j].content}</p>
                        <span>date: ${docs[j].date}</span><br>
                        <span>Background color: <span class="colorPreview" style="background-color:${docs[j].background}"></span> ${docs[j].background}</span><br>
                        <span>text color: <span class="colorPreview" style="background-color:${docs[j].textColor}"></span> ${docs[j].textColor}</span><br>
                        <span>Image: </span><span>${docs[j].image}</span> - 
                        <svg id="previewEye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                        </svg><br>
                        <button onclick="deleteAbout('${docs[j]._id}')">DELETE</button>
                    </div>

                    <hr>
                `;
                html = html + result;

            }
            document.getElementById("form4").innerHTML = html;
            loadPreviewImageAbout()
    })

}

function displayNewsOnLoad() {
    client.auth
    .loginWithCredential(new stitch.AnonymousCredential())
    .then(displayNews)
    .then(displayAbout)
    .catch(console.error);
}

function addNew() {
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const content = document.getElementById('content').value;
    const date =  document.getElementById('date').value;
    const url = document.getElementById('url').value;
    const file = document.getElementById('file').files[0].name;

    // Print log anonymous user
    console.log("add album", client.auth.user.id)
    
    db.collection("news")
        .insertOne({
            "owner_id": client.auth.user.id,
            "title": title,
            "subtitle": subtitle,
            "content": content,
            "date": date,
            "url": url,
            "image": file
        })
        .then(displayNews)
        alert("Noticia subida corretamente");
}

function addAbout(){
    const title = document.getElementById('titleAbout').value;
    const subtitle = document.getElementById('subtitleAbout').value;
    const content = document.getElementById('contentAbout').value;
    const date = document.getElementById('dateAbout').value;
    const cBackground = document.getElementById('backgroundAbout').value;
    const cText = document.getElementById('textColorAbout').value;
    const fileAbout = document.getElementById('fileAbout').files[0].name;
    console.log(fileAbout)
    // Print log anonymous user
    console.log("add album", client.auth.user.id)
    
    db.collection("about")
        .insertOne({
            "owner_id": client.auth.user.id,
            "title": title,
            "subtitle": subtitle,
            "content": content,
            "date": date,
            "background": cBackground,
            "textColor": cText,
            "image": fileAbout
        })
        .then(displayAbout)
        alert("Algo subido corretamente");
}

function deleteNews(id) {
    console.log("delete album", client.auth.user.id)
    const query = { "_id": new stitch.BSON.ObjectId(id) };

    db.collection("news")
    .deleteOne(query)
    .then(displayNews);
}

function loadPreviewImage(){
    const newsDiv = document.getElementById('form3');
    const newsCount = newsDiv.getElementsByTagName('div');
    for(let i = 0; i < newsCount.length; i++){
        let newsURL = newsCount[i].children[8].innerHTML;

        newsCount[i].children[9].addEventListener('click', () => {
            previewImage(newsURL);
        })
    }
}

function loadPreviewImageAbout(){
    console.log('Test')
    const newsDiv = document.getElementById('form4');
    const newsCount = newsDiv.getElementsByTagName('div');
    for(let i = 0; i < newsCount.length; i++){
        let newsURL = newsCount[i].children[10].innerHTML;

        newsCount[i].children[11].addEventListener('click', () => {
            previewImage(newsURL);
        })
    }
}

function changeForm(index){
    const navItems = document.getElementsByClassName('sidebar')[0].children;
    for(let i = 0; i < navItems.length - 1; i++){
        if(navItems[i].classList[0] == 'sidebar-active'){
            navItems[i].classList.remove('sidebar-active');
            navItems[i].classList.add('sidebar-noactive');
        };
    }
    navItems[index].classList.remove('sidebar-noactive');
    navItems[index].classList.add('sidebar-active');

    var oldForm = document.getElementById(`form${currentForm}`);
    var newForm = document.getElementById(`form${index+1}`)

    oldForm.style.transition = '.5s';
    oldForm.style.transform = 'scale(90%)';
    oldForm.style.opacity = 0;

    newForm.style.transform = '';

    setTimeout(() => {
        oldForm.setAttribute('style', 'display: none; opacity: 0;');
        newForm.style.display = 'inline';
        newForm.style.transform = 'scale(90%)';

        setTimeout(() => {
            newForm.style.transition = '.5s'
            newForm.style.opacity = 1;
            newForm.style.transform = 'scale(100%)';
        }, 50)
    }, 310)

    currentForm = index+1;
}

function previewImage(url){
    document.getElementsByTagName('body')[0].innerHTML += `
    <div class="previewContainer" id="previewContainer" style="display:none; opacity: 0">
        <img src="../images/noticias/${url}">
        <span id="close">X</span>
    </div>`

    const previewDiv = document.getElementById('previewContainer');
    previewDiv.style.display = 'flex';
    setTimeout(() => {
        previewDiv.style.transition = '.3s';
        previewDiv.style.opacity = 1;
        document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
    })

    document.getElementById('close').addEventListener('click', () => {
        closePreview();
    })
}

function closePreview(){
    const previewDiv = document.getElementById('previewContainer');
    previewDiv.style.opacity = 0;
    setTimeout(() => {
        previewDiv.style.display = 'none';
        previewDiv.remove();
        document.getElementsByTagName('body')[0].style.overflowY = 'auto';
    }, 310)
    loadPreviewImage();
    loadPreviewImageAbout();
    loadFormChange()
}

function loadFormChange(){
    const navItems = document.getElementsByClassName('sidebar')[0].children;
    for(let i = 0; i < navItems.length - 1; i++){
        navItems[i].addEventListener('click', () => {
            changeForm(i)
        });
    }
}