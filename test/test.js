/**
 * Created by luisandresgurmendez on 13/6/17.
 */



// Error examples



test = {

    test: function(cb){

        console.log("Llamada async.")

        setTimeout(function(){
            err =  new Error("Error ivan gay")

            cb(err)
        },1000)
    }
}



try{

    test.test(function(err){
        try{
            if(err) throw err
            console.log("Catched error 2")
        }catch(e){
            console.log("catched error 3 " + e.message)
        }
    })


}catch(e){
    console.log("Error catcheado")
    console.log(e)

}

console.log("Nico gay")









