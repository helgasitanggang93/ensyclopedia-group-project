function getData() {
    $.ajax({
        url : 'https://en.wikipedia.org/api/rest_v1/page/random/summary',
        method: 'GET'
    })
    .done(function(response) {
        console.log(response)
        $("#extract-title").append(`${response.title}`);
        $("#extract-paragraph").append(`${response.extract}`);
        $("#image").append(`<img src=${response.thumbnail.source} class="rounded mx-auto d-block">`);

    })
    .fail(function(jqXHR, textStatus) {
        console.log('request fail', textStatus)
        
    })
}

$(document).ready(function () {
    getData()
    
})