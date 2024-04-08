
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="index.css">
    <title>Vart är vi påväg: Malmö Edition</title>
</head>
<body>
    
    <main id="main"></main>

    <?php
    $scriptSrc = ($_SERVER['REQUEST_URI'] === '/') ? 'index.js' : './components' . $_SERVER['REQUEST_URI'] . $_SERVER['REQUEST_URI'] .'.js' ;
    ?>
<script type="module" src="<?php echo $scriptSrc; ?>">
    console.log('hejhej')

    import { PubSub } from './logic/pubsub.js';
import { STATE } from './logic/state.js'
import * as cm from './components/componentManager.js';
import * as start from './components/start/start.js';


</script>

    <!-- <script type="module" id="my-script">

        const scriptTag = document.getElementById('my-script');

        if( === '/'){
            scriptTag.setAttribute('src', './index.js')
        }
        
        </script>
</body>
</html>