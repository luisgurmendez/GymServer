/**
 * Created by luisandresgurmendez on 5/6/17.
 */


jQuery(document).ready(function() {
    console.log("listender")
    $("#dashboard-loggout-btn").click(function(){
        console.log("click")
        $.ajax({
            url:"http://localhost:3000/logout",
            type:"POST",
            success: function(data){

                window.location=data.redirect


            },
            error: function() {
                alert("Error while logging out.")

            }
        })



    })

});




