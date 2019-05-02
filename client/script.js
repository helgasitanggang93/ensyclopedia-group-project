let annotate = null;
let text = null;

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

    })
    .fail(function(jqXHR, textStatus) {
        console.log('request fail', textStatus)
    })
}

function getVideo() {
    event.preventDefault();
   
    $.ajax({
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${annotate}&type=video&key=AIzaSyDKo47lqPDAv1Bt_ox736vR0DfbNJzEHyw`,
        method : 'GET',
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
    let lang = 'id'
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