let annotate = null;
let text = null;
var globalEntities = []

let baseURL = 'http://localhost:3000'

function getData() {
    $.ajax({
        url : 'https://en.wikipedia.org/api/rest_v1/page/random/summary',
        method: 'GET'
    })
    .done(function(response) {
        console.log(response)
        annotate = response.title
        $("#extract-title").html(``);
        $("#extract-title").append(`${response.title}`);
        text = response.extract
        $("#extract-paragraph").html(``);
        $("#extract-paragraph").append(`${response.extract}`);
        $("#image").html(``);
        $("#image").append(`<img src=${response.thumbnail.source} class="rounded mx-auto d-block">`);

        getVideo()

        getTextEntities(response.extract)
    })
    .fail(function(jqXHR, textStatus) {
        console.log('request fail', textStatus)
        
    })
}

function searchData() {
    event.preventDefault()
    
    let query = $('#query').val()
    console.log(query,'===');
    
    $.ajax({
        url : `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`,
        method: 'GET'
    })
    .done(function(response) {
        console.log(response)
        annotate = response.title
        $("#extract-title").html(``);
        $("#extract-title").append(`${response.title}`);
        text = response.extract
        $("#extract-paragraph").html(``);
        $("#extract-paragraph").append(`${response.extract}`);
        $("#image").html(``);
        $("#image").append(`<img src=${response.thumbnail.source} class="rounded mx-auto d-block">`);

        getVideo()

        getTextEntities(response.extract)
    })
    .fail(function(jqXHR, textStatus) {
        console.log('request fail', textStatus)
    })
}

function getTextEntities(text) {
    $.ajax({
        url : 'http://localhost:3000/analyze',
        method: 'POST',
        data: {text: text},
    })
    .done(function(response) {
        console.log(response)
        globalEntities = []
        $('#entities').html('')
        response.forEach(res => {
            let template = 
            `<a href="https://www.google.com/search?q=${res.name}"><span class="badge badge-pill badge-primary">${res.name}</span></a>&nbsp`
            $('#entities').append(template)
            globalEntities.push(res.name)
        })
    })
    .fail(function(jqXHR, textStatus) {
        console.log('request fail', textStatus)
    })
}

function getVideo() {
    event.preventDefault();
   
    $.ajax({
        url: `${baseURL}/youtube`,
        method : 'GET',
        headers : {annotate}
    })
    .done( response => {
   
        $('#video').html(`
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${response.items[0].id.videoId}?autoplay=1"></iframe>`   
        )
    })
    .fail((err) => {
        console.log(err);
    })
}

function getTranslate(params) {
    event.preventDefault();
    let lang = $('#language').val()
    console.log(text,);
    
    $.ajax({
        url : `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190502T124126Z.73aca3f466fa052f.43c6bb553292f8cdd525d1af35c0b902ef401cf8&text=${text}&lang=en-${lang}`,
        method : 'GET'
    })
    .done( response => {
        let result = response.text[0];
        $("#extract-paragraph").html(``);
        $("#extract-paragraph").append(`${result}`);
    })
    .fail((err) => {
        console.log(err);
    })
    
}

$(document).ready(function () {
    getData()
})
