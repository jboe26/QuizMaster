$(document).ready(function(){
    $('#profileBtn').on('click', function(e){
        $.ajax({
            url: '/profile',
            method: 'GET'
        }).then(function(){
            alert('success');
        });
    }); 
})