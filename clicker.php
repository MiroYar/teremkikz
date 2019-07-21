<?php

function redirectToMessenger(){
    $messenger = $_GET['messenger'];
    $phone = $_GET['phone'];
    if ($messenger == 'tel'){
        $new_url = 'tel:+'.$phone.'';
    }
    else if ($messenger == 'viber'){
        $new_url = 'viber://chat?number=%2B'.$phone.'';
    }
    header('Location: '.$new_url.'');
    exit();
}
redirectToMessenger();

?>