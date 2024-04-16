<?php
ini_set("display_errors", 1);

require_once "central.php";

if($requestMethod == "POST"){
    
    if(!isset($requestData['key'], $requestData['entity'])) {
        abort(400, "Bad Request (missing keys)");
    }

    $key = $requestData["key"];
    
    if(isset($requestData["place"])){
        $place = $requestData["place"];

        foreach($entityData as $index => $quizElement){

            if($quizElement["place"] == $place){
        
                if($quizElement["key"] == $key){
                    sendJson(["isCorrect" => true], 200);
                }else {
                    sendJson(["isCorrect" => false], 200);
                }
            }
        }

        abort(400, "Can't find the quiz");
    }


    // if($_GET["entity"] == 'CLUES'){
    //     foreach($entityData as $index => $clueElement){
    //         if($clueElement["key"] == $key){
    //             sendJson(["clues" => $clueElement["clues"], "destination" => $clueElement["destination"]], 200);
    //         }
    //     }
    // }




}